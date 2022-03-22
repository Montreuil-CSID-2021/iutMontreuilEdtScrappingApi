// - - - Node Module - - - //
import fs from "fs"

export default class ColorSetter {
    private dataDir = `${__dirname}/../Data`

    colorPalette: Array<string> = [
        "#fceeac",
        "#c9fcac",
        "#c3fad5",
        "#bafaee",
        "#c7f6fc",
        "#e9edfe",
        "#e6eefe",
        "#fee7fc",
        "#fee9e6",
        "#feecc2",
        "#fcbfbf",
        "#bccdff",
        "#b8fec9",
        "#bfccfb",
        "#eac7b2",
        "#fcc0b0"
    ]

    colorAttribution: Array<{edtName: string, colors: Array<{subject: string, color: string}>}> = []

    constructor() {
        if(fs.existsSync(`${this.dataDir}/colors.json`)) {
            this.colorAttribution = JSON.parse(fs.readFileSync(`${this.dataDir}/colors.json`, {encoding: "utf-8"}))
        }
    }

    getColorForSubjectOfEdt(subject: string, edtName: string) {
        subject = subject.toLowerCase()
        let edt = this.colorAttribution.find(e => e.edtName = edtName)
        if(!edt) {
            edt = {edtName: edtName, colors: []}
            this.colorAttribution.push(edt)
        }
        let sc = edt.colors.find(c => c.subject === subject)
        if(sc) return sc.color
        else {
            sc = {
                subject: subject,
                color: "#e5e5e5"
            }

            let newColor = this.colorPalette.find(c => !edt.colors.map(ec => ec.color).includes(c))
            if(newColor) sc.color = newColor

            this.colorAttribution[this.colorAttribution.findIndex(e => e.edtName = edtName)]?.colors.push(sc)
            this.saveColors()
            return sc.color
        }
    }

    saveColors() {
        if(!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, 0o774)
        }

        fs.writeFileSync(`${this.dataDir}/colors.json`, JSON.stringify(this.colorAttribution), {encoding: 'utf-8'})
    }
}