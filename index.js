const bittrex = require('node-bittrex-api');

bittrex.options({
});

let currencies = [];
const percentage = (98 / 100);

function Currency() {
    this.name = '';
    this.buyPrice = 0;
    this.sellPrice = 0;
    this.lastPrice = 0;
    this.currentPrice = 0;
    this.balance = 0;

    // this.getTicker = function () {
    //     this.currentPrice = getCurrentPrice(this.name);
    // };

    this.sell = function () {
        sellCurrency(this.name);
    };
}

function init() {
    bittrex.getbalances(function (data, err) {
        for (let currency of data.result) {
            if (currency.Balance > 0 && currency.Currency !== "BTC") {
                let ownedCurrency = new Currency();
                ownedCurrency.name = currency.Currency;
                ownedCurrency.balance = currency.Balance;
                getCurrentPrice(ownedCurrency.name).then(res => {
                    ownedCurrency.currentPrice = res;
                    ownedCurrency.buyPrice = ownedCurrency.currentPrice;
                    ownedCurrency.sellPrice = (ownedCurrency.currentPrice * percentage);
                    console.log(ownedCurrency);
                    setInterval(routine.bind(this, ownedCurrency), 30000);

                });
            }
        }
    });
}

function getPercentage(currency) {
    return (((currency.currentPrice - currency.buyPrice) / currency.currentPrice) * 100).toFixed(3) + '%';
}

function getCurrentPrice(currencyName) {
    return new Promise((resolve, reject) => {
        bittrex.getticker({market: 'BTC-' + currencyName}, function (data, err) {
            if (err) throw new Error("Currency not found!");
            resolve(data.result.Ask);
        });
    });
}

function sellCurrency(currencyName) {
    console.log("Sell " + currencyName);
    console.log("Sell " + currencyName);
    console.log("Sell " + currencyName);
    console.log("Sell " + currencyName);
    console.log("Sell " + currencyName);
}


function routine(currency) {
    getCurrentPrice(currency.name).then(res => {
        currency.currentPrice = res;

        if (currency.currentPrice <= currency.sellPrice) currency.sell();

        if (currency.currentPrice > currency.lastPrice) {
            console.log(currency.name + " : Up! Market now at : " + currency.currentPrice.toFixed(8) + ' / ' + getPercentage(currency));
            if (currency.currentPrice > currency.buyPrice) currency.sellPrice = currency.currentPrice * 0.98;
        }

        if (currency.currentPrice < currency.lastPrice) {
            console.log(currency.name + " : Down! Market now at : " + currency.currentPrice.toFixed(8) + ' / ' + getPercentage(currency));
        }

        currency.lastPrice = currency.currentPrice;
    });
}

init();