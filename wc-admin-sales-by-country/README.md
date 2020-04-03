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
* Integrate a different chart control to plot per-country data.
* Properly handle date ranges instead of hardcoding one.
* Add placeholder components to display while data is loading - instead of the current stub. 
* Implement paging in `TableCard`.
* Implement sorting in `TableCard`.
* Ensure proper rounding for numerical data.
* :white_check_mark: Introduce currency formatting.
* Create a dashboard widget (country leaderboard - similar to the main report's `TableCard` content).
* Consider dropping the `/countries/` endpoint, and replacing it with a backend filter on the `/customers/` (or `/orders/`?) endpoint.
* Internationalize.
* Refactor for readability.
* Cover with tests.
* Write a guide to document how you got there.
