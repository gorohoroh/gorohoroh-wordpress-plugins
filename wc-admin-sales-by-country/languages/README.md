# Languages

## Generating POT

When `npm start` is running, a POT template file is generated automatically by Webpack as part of the build process (credit to [StackOverflow](https://stackoverflow.com/a/49786887/226537)).

To generate a POT template file manually, run the following command from the root directory of this plugin:

```
wp i18n make-pot src languages/wc-admin-sales-by-country.pot --domain=wc-admin-sales-by-country
```