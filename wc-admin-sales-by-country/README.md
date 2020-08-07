# WC Admin Sales by Country

This is a [WooCommerce](https://woocommerce.com/) extension that shows how store sales are distributed between countries. Inspired by an existing reporting plugin, [Sales Report By Country for WooCommerce](https://href.li/?https://www.zorem.com/products/woocommerce-sales-report-by-country/). Integrates into WooCommerce's *Analytics* section in WordPress admin area. Uses WooCommerce's REST API and React components. Serves as a demo of a new JavaScript and React based extensibility model introduced by [WooCommerce Admin](https://wordpress.org/plugins/woocommerce-admin/).

## System requirements

* WordPress 5.3 or later.
* WooCommerce 4.0 or later.

## Installation and usage

1. Download the [latest release](https://github.com/gorohoroh/gorohoroh-wordpress-plugins/release) as a zip archive.

2. Extract the archive to your WordPress installation's *wp-content/plugins* directory.

3. In the admin area of your WordPress installation, go to *Plugins | Install Plugins*, locate the extension called `wc-admin-sales-by-country`, and click *Activate*.

4. In the admin area of your WordPress installation, go to *Analytics | Sales by Country*.

## Development

If you are looking to set up a local development environment for the source code of this plugin, here are the steps you need to take:

1. Make sure that your local development environment meets the requirements [listed here](https://github.com/gorohoroh/gorohoroh-wordpress-plugins/blob/master/wc-admin-sales-by-country/tutorial/tutorial-sales_by_country.md#what-youll-need).

2. Clone this repository to your local WordPress installation's *wp-content/plugins* directory.

3. In the admin area of your WordPress installation, go to *Plugins | Install Plugins*, locate the extension called `wc-admin-sales-by-country`, and click *Activate*.

4. In the root directory of this plugin (`{your_WordPress_installation}/wp-content/plugins/wc-admin-sales-by-country/`), run `npm install && npm start`.

5. In the admin area of your WordPress installation, go to *Analytics | Sales by Country* to open that report that this plugin adds.

You can now start editing source code in your working copy of this repository. JavaScript and Scss will be built automatically as you make changes, and these changes will be reflected in the plugin's report page.

## Tasks
* :white_check_mark: Add plugin page to WP menu.
* :white_check_mark: Add plugin to WC breadcrumbs navigation.
* :white_check_mark: Add component layout to report page.
* :white_check_mark: Add and use dummy data while live data isn't available.
* :white_check_mark: Choose REST API endpoints that provide required data and fetch from them.
* :white_check_mark: Transform fetched data and save it to component state.
* :white_check_mark: Ensure component waits until data is ready before rendering.
* :white_check_mark: Replace dummy data with live data in summary view (`SummaryList`).    
* :white_check_mark: Replace dummy data with live data in per-country table view (`TableCard`).
* :white_check_mark: Integrate a different chart control to plot per-country data.
* :white_check_mark: Properly handle date ranges instead of hardcoding.
* :white_check_mark: Add placeholder components to display while data is loading - instead of the current stub. 
* Implement pagination in `TableCard`.
* :white_check_mark: Implement sorting in `TableCard`.
* :white_check_mark: Ensure proper rounding for numerical data.
* :white_check_mark: Handle empty JSON returns (no data for a selected period) to prevent the indefinite "Waiting for data"
* Support previous periods.
* :white_check_mark: Flatten data object structure (get rid of the `stats` wrapper property)
* :white_check_mark: Introduce currency formatting.
* Create a [dashboard widget](https://github.com/woocommerce/woocommerce-admin/tree/master/docs/examples/extensions/dashboard-section) (country leaderboard - similar to the main report's `TableCard` content).
* Fetch data using [`wp.data`](https://developer.wordpress.org/block-editor/packages/packages-data/).
* `SalesByCountryReport.handleDateChange()`: compare date ranges in old and new queries; don't fetch if they're equal, or if a date range in the new query is within the date range in the old query.
* :white_check_mark: `SalesByCountryReport.fetchData()`: fetch all countries once, add them to state, then read from the state instead of fetching again.
* :white_check_mark: `TablePlaceholder`, `CountryTable`: reuse headers
* :white_check_mark: Add doc comments to functions.
* Review to follow WordPress coding standards.
* :white_check_mark: Internationalize.
* :white_check_mark: Refactor for readability.
* Cover with tests.
* :white_check_mark: Extend this README with install/activate/build instructions.
* :white_check_mark: Write a [guide](https://gorohovsky.com/extending-woocommerce-javascript-react/) to document how you got there.
