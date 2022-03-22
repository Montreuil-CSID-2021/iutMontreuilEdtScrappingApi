const Logs = require("../commons/Logs");
const {webkit, Page, ElementHandle, HtmlElement} = require("playwright");
const EdtDay = require("./EdtDay");
const User = require('./User')
const LiteUser = require("./LiteUser");

class Scrapper {
    /**
     * @private
     * @param credential {EdtCredential}
     * @return Promise<{
     *     user: User,
     *     page: Page,
     *     availableWeek: {
     *         value: string,
     *         text: string
     *     }[],
     *     profList: String[]
     * }>
     */
    async _login(credential) {
        // Lancement du navigateur
        Logs.info(`Chargement d'un navigateur de scrapping`)
        let browser = await webkit.launch()
        let context = await browser.newContext()
        let page = await context.newPage()

        // Ouverture du site le l'iut
        await page.goto(`https://cas.iut.univ-paris8.fr/login?service=https%3a%2f%2fent.iut.univ-paris8.fr%2f`)

        // Connexion
        Logs.info(`Connexion à l'ENT de ${credential.username}`)
        await page.fill("#username", credential.username)
        await page.fill("#password", credential.password)
        await page.click("text=SE CONNECTER")

        // Test de succès de la connexion
        if (!(await page.title()).includes('ENT')) {
            Logs.error(`Échec de connexion à l'ENT de ${credential.username}`)
            throw new Error("bad login")
        } else Logs.info(`Connexion réussite à l'ENT de ${credential.username}`)

        // Récupération de la page d'emploi du temps
        await page.goto(`https://ent.iut.univ-paris8.fr/edt/presentations.php`)

        // Emploi du temps sélectionné pour le compte utilisateur
        let selectedEdt = await page.$eval('#selectpromo', /** @param sel {HTMLSelectElement} */(sel) => sel.options[sel.options.selectedIndex].textContent)
        Logs.info(`${credential.username} connecté sur l'emploi du temps ${selectedEdt} `)

        // Récupération de la liste des semaines
        let availableWeek = []
        for (let option of (await (await page.$('#selectsem')).$$('option'))) {
            availableWeek.push({
                text: await option.innerText(),
                value: await option.getAttribute('value')
            })
        }

        // Récupération des profs
        let profList = []
        for (let option of (await (await page.$('#selectprof')).$$('option'))) {
            profList.push(await option.innerText())
        }

        return {
            user: new User(credential.username, credential.password, selectedEdt),
            page: page,
            availableWeek: availableWeek,
            profList: profList
        }
    }

    /**
     * @private
     * @param page {Page}
     * @param date {{
     *     value: string,
     *     text: string
     * }}
     * @param profList {string[]}
     * @return {Promise<EdtDay[]>}
     */
    async _parseWeek(page, date, profList) {
        let mondayDate = new Date(date.value * 1000)

        Logs.info(`Parsing : ${mondayDate.toLocaleDateString()}`)

        await page.evaluate((date) => modifDate(date.value), date)

        /** @type EdtDay[] */
        let days = []
        for (let el of /** @type ElementHandle<HtmlElement>[] */ await page.$$('#quadrillage > .plageDIV')) {
            let css = (await el.getAttribute('style'))
                .replaceAll(' ', '')
                .split(';')
                .map(c => {
                    let key_value = c.split(':')
                    return {
                        key: key_value[0],
                        value: key_value[1]
                    }
                }
            )

            let height = css.find(c => c.key === "height").value.replace('px', '')
            let ml = css.find(c => c.key === "margin-left").value.replace('%', '')
            let top = css.find(c => c.key === "top").value.replace('px', '')

            let day = new EdtDay()
            day.startDate = new Date(mondayDate.getTime() + (((24 * 60 * 60 * ml / 80 * 4) + (60 * (top - 30 + 480))) * 1000))
            day.endDate = new Date(day.startDate.getTime() + ((60 * height) * 1000))

            try {
                day.subject = await (await el.$("strong")).innerText()
            } catch (e) {
                try {
                    day.subject = await (await el.$("span.plageCTRL")).innerText()
                } catch (e) {
                    day.subject = "Erreur de récupération"
                }
            }

            /** @type ElementHandle<HtmlElement>[] */
            let tds = await el.$$('td')

            let td0 = tds[0]
            try {
                let profLettre = await (await td0.$('span.plageHG')).innerText()
                let profName = profList.find(prof => prof.includes(`[${profLettre}]`))
                day.teacher = (profName) ? profName.toUpperCase() : profLettre
            } catch (e) {
                day.teacher = "Autonomie"
            }

            let tdLast = tds[tds.length - 1]
            try {
                day.location = (await (await tdLast.$('span.plageHG')).innerText()).split('&')[0]
                if (day.location.includes('@')) day.location = "À distance"
            } catch (e) {
                day.location = "Aucune"
            }

            days.push(day)
        }

        return days
    }

    /**
     * @param credential {EdtCredential}
     * @param event {EventEmitter}
     */
    scrapForWeb(credential, event) {
        Logs.info(`Récupération EDT : ${credential.username}`)

        // Connexion
        this._login(credential)
            .then(async data => {
                let user = data.user
                let page = data.page
                let availableWeek = data.availableWeek
                let profList = data.profList

                event.emit('login', new LiteUser(user))

                /** @type {EdtDay[]} */
                let days = []
                // Pour chaque semaine disponible
                for(const date of availableWeek) {
                    try {
                        let edtDays = await this._parseWeek(page, date, profList)

                        days = days.concat(edtDays)
                        event.emit('update', days)
                    } catch (e) {}
                }

                await page.context().browser().close()
            })
            .catch(e => {
                event.emit('login', null)
            })
    }
}

module.exports = Scrapper
