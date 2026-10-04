# Portfolio Visitor Logging (Google Sheet)

This folder contains a Google Apps Script that logs portfolio visits
(date/time, approximate location, page, referrer, user agent, and a
repeat-visit count) to a Google Sheet. It pairs with `visitor-tracker.js`
in the repo root, which is included on the portfolio page.

> **Privacy note:** Exact visitor IP addresses are never stored. The
> tracker resolves an approximate city/region/country from the visitor's
> IP using a public lookup service (ipapi.co) in the browser, and only
> that derived location — plus a random anonymous ID used to detect
> repeat visits — is sent to the sheet.

## 1. Create the Google Sheet

1. Create a new Google Sheet (e.g. "Portfolio Visitors Log").
2. Open **Extensions → Apps Script**.
3. Delete the default `Code.gs` content and paste in the contents of
   [`Code.gs`](./Code.gs) from this folder.
4. Save the project (give it any name, e.g. "Portfolio Visitor Logger").

The script will automatically create a sheet tab named
`Portfolio Visitors` with these columns the first time it runs:

| Timestamp | Last Visit | Visitor ID | City | Region | Country | Visit Count | Page | Referrer | User Agent |
|---|---|---|---|---|---|---|---|---|---|

## 2. Deploy as a Web App

1. In the Apps Script editor, click **Deploy → New deployment**.
2. Select type **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**, authorize the requested permissions, and copy the
   generated **Web app URL**.

## 3. Configure the site

1. Open `visitor-tracker.js` in the repository root.
2. Replace `YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` with the Web app URL from
   step 2.
3. Commit and deploy the site. Visits will now appear in your Google
   Sheet, with the `Visit Count` column incrementing for the same
   browser/device instead of creating duplicate rows.

## Notes & limitations

- Repeat-visit detection relies on a random ID stored in the visitor's
  browser `localStorage`. Clearing site data, using a different browser,
  or private/incognito mode will register as a new visitor.
- Location data is approximate (city/region level) and depends on the
  visitor's ISP-assigned IP; it is not precise GPS location.
- If you redeploy the Apps Script (not just update code and save), you
  must create a **new version** under **Deploy → Manage deployments** or
  the live URL will keep serving the old code.
