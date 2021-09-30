// https://github.com/projectfluent/fluent.js/wiki/React-Bindings
import 'intl-polyfill';
import { negotiateLanguages } from '@fluent/langneg';
import { FluentBundle, FluentResource } from '@fluent/bundle';
import { ReactLocalization } from '@fluent/react';

const PATHS = {
    'en-US': '/react/localization/en-US/main.ftl',
    'pl': '/react/localization/pl/main.ftl',
}

// A generator function responsible for building the sequence 
// of FluentBundle instances in the order of user's language
// preferences.
function* generateBundles(resources: { [key: string]: FluentResource }, userLocales: any) {
    // Choose locales that are best for the user.
    const currentLocales = negotiateLanguages(
        userLocales,
        ['en-US', 'pl'],
        { defaultLocale: 'en-US' }
    );

    for (const locale of currentLocales) {
        const bundle = new FluentBundle(locale);
        bundle.addResource(resources[locale]);
        yield bundle;
    }
}
async function main() {
    const resources: { [key: string]: FluentResource } =
        Object.fromEntries(await Promise.all(Object.entries(PATHS).map(async ([key, path]) => {
            const res = await fetch(path)
            const body = await res.text()
            // console.log(key, body)
            return [key, new FluentResource(body)]
        })))
    return new ReactLocalization(generateBundles(resources, navigator.languages));
}

// The ReactLocalization instance stores and caches the sequence of generated
// bundles. You can store it in your app's state.
export default main