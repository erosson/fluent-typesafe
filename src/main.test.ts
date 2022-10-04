import * as Parser from "./parser"
import ElmFormat from "./codegen/elm"
import ReactFormat from "./codegen/react"
import ReactDomFormat from "./codegen/react-dom"
import { parse } from "path"

async function expectSnapshots(body: string, prefix: string = ''): Promise<Parser.Resource> {
    const path = "app.ftl"
    const parsed: Parser.Resource = Parser.parseResource_(path, body)
    expect(parsed).toMatchSnapshot()
    const formats = [
        { label: 'elm', format: ElmFormat },
        { label: 'react', format: ReactFormat },
        { label: 'react-dom', format: ReactDomFormat },
    ]
    await Promise.all(formats.map(async ({ label, format }) => {
        const writer = jest.fn()
        await format([[path, Promise.resolve(parsed)]], writer)
        expect(writer.mock.calls.length).toBe(2)
        // consistent windows/linux path behavior
        const calls = writer.mock.calls.map(([path, body]) => [path.replace('\\', '/'), body])
        expect({ label, calls }).toMatchSnapshot(prefix + label)
    }))
    return parsed
}

test("simple", async () => {
    const body = `\
hello = world
`
    const parsed = await expectSnapshots(body)
    expect(parsed.messages).toHaveLength(1)
    expect(new Set(parsed.messages.map(m => m.id))).toEqual(new Set(['hello']))
})
test("projectfluent.org example 1", async () => {
    const body = `\
# Simple things are simple.
hello-user = Hello, {$userName}!

# Complex things are possible.
shared-photos =
    {$userName} {$photoCount ->
        [one] added a new photo
       *[other] added {$photoCount} new photos
    } to {$userGender ->
        [male] his stream
        [female] her stream
       *[other] their stream
    }.
`
    const parsed = await expectSnapshots(body)
    expect(parsed.messages).toHaveLength(2)
    expect(new Set(parsed.messages.map(m => m.id))).toEqual(new Set(['hello-user', 'shared-photos']))
})

test("projectfluent.org example 2", async () => {
    const body = `\
## Closing tabs

tabs-close-button = Close
tabs-close-tooltip = {$tabCount ->
    [one] Close {$tabCount} tab
   *[other] Close {$tabCount} tabs
}
tabs-close-warning =
    You are about to close {$tabCount} tabs.
    Are you sure you want to continue?

## Syncing

-sync-brand-name = Firefox Account

sync-dialog-title = {-sync-brand-name}
sync-headline-title =
    {-sync-brand-name}: The best way to bring
    your data always with you
sync-signedout-title =
    Connect with your {-sync-brand-name}`
    const parsed = await expectSnapshots(body)
    expect(parsed.messages).toHaveLength(6)
    // expect(new Set(parsed.messages.map(m => m.id))).toEqual(new Set(['hello-user', 'shared-photos']))

    const body2 = `\
## Closing tabs

tabs-close-button = Chiudi
tabs-close-tooltip = {$tabCount ->
    [one] Chiudi {$tabCount} scheda
   *[other] Chiudi {$tabCount} schede
}
tabs-close-warning =
    Verranno chiuse {$tabCount} schede. Proseguire?

## Syncing

-sync-brand-name = {$first ->
   *[uppercase] Account Firefox
    [lowercase] account Firefox
}

sync-dialog-title = {-sync-brand-name}
sync-headline-title =
    {-sync-brand-name}: il modo migliore
    per avere i tuoi dati sempre con te
sync-signedout-title =
    Connetti il tuo {-sync-brand-name(first: "lowercase")}
`
    const parsed2 = await expectSnapshots(body2, 'it:')
    expect(parsed2.messages).toHaveLength(parsed.messages.length)
    expect(new Set(parsed2.messages.map(m => m.id))).toEqual(new Set(parsed.messages.map(m => m.id)))
})

test("params", async () => {
    const body = `\
hello = world
with-string-variable = hello {$world}
with-string-term = hello {hello}
with-number-variable = there are {NUMBER($num)} lights
`
    const parsed = await expectSnapshots(body)
    expect(parsed.messages).toHaveLength(4)
    expect(new Set(parsed.messages.map(m => m.id))).toEqual(new Set(['hello', 'with-string-variable', 'with-string-term', 'with-number-variable']))
})

test("kw-params", async () => {
    const body = `\
hello = world
-with-variable = hello {$world}
with-kw-literal = hello {-with-variable(world: "world")}
fails-with-kw-variable = hello {-with-variable(world: $world)}

with-pub-variable = hello {$world}
fails-with-pub-kw-literal = hello {with-pub-variable(world: "world")}
`
    const parsed = await expectSnapshots(body)
    console.log(parsed.resource)
    expect(parsed.messages).toHaveLength(3)
    expect(new Set(parsed.messages.map(m => m.id))).toEqual(new Set(['hello', 'with-kw-literal', 'with-pub-variable']))
})