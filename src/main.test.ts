import * as Parser from "./parser"
import ElmFormat from "./codegen/elm"
import ReactFormat from "./codegen/react"
import ReactDomFormat from "./codegen/react-dom"

test("simple", async () => {
    const path = "app.ftl"
    const ftl = `\
hello = world
`
    const parsed: Parser.Resource = Parser.parseResource_(path, ftl)
    expect(parsed).toMatchSnapshot()
    for (let { label, format } of [{ label: 'elm', format: ElmFormat }, { label: 'react', format: ReactFormat }, { label: 'react-dom', format: ReactDomFormat }]) {
        const writer = jest.fn()
        await format([[path, Promise.resolve(parsed)]], writer)
        expect(writer.mock.calls.length).toBe(2)
        // consistent windows/linux path behavior
        const calls = writer.mock.calls.map(([path, body]) => [path.replace('\\', '/'), body])
        expect({ label, calls }).toMatchSnapshot()
    }
})