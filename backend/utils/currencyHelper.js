const https = require("https");

/**
 * Fetches the exchange rate from baseCurrency to targetCurrency.
 * Uses https://api.exchangerate-api.com/v4/latest/{baseCurrency}
 * @returns {Promise<number>} The conversion rate
 */
function fetchRate(baseCurrency, targetCurrency) {
    return new Promise((resolve, reject) => {
        const url = `https://api.exchangerate-api.com/v4/latest/${baseCurrency.toUpperCase()}`;
        https.get(url, (res) => {
            let data = "";
            res.on("data", (chunk) => { data += chunk; });
            res.on("end", () => {
                try {
                    const parsed = JSON.parse(data);
                    const rate = parsed.rates[targetCurrency.toUpperCase()];
                    if (rate === undefined) {
                        return reject(new Error(`Currency '${targetCurrency}' not found in rates`));
                    }
                    resolve(rate);
                } catch (err) {
                    reject(new Error("Failed to parse exchange rate response"));
                }
            });
        }).on("error", (err) => reject(err));
    });
}

/**
 * Converts an amount from one currency to another.
 * @returns {Promise<number>} The converted amount (rounded to 2 decimal places)
 */
async function convertAmount(amount, fromCurrency, toCurrency) {
    if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) {
        return parseFloat(amount);
    }
    const rate = await fetchRate(fromCurrency, toCurrency);
    return parseFloat((amount * rate).toFixed(2));
}

module.exports = {
    fetchRate,
    convertAmount,
};
