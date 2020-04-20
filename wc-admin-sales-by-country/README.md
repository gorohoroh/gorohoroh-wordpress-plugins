# WC Admin Sales by Country

A WooCommerce Admin extension that breaks down sales by country. Inspired by an existing reporting plugin, [Sales Report By Country for WooCommerce](https://href.li/?https://www.zorem.com/products/woocommerce-sales-report-by-country/). Integrates into WooCommerce's *Analytics* section. Uses WooCommerce's REST API and React components. Serves as a demo of WooCommerce Admin extensibility.

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
* Add doc comments to functions.
* Review to follow WordPress coding standards.
* Internationalize.
* Refactor for readability.
* Cover with tests.
* Extend this README with install/activate/build instructions.
* Write a guide to document how you got there.
