const bittrex = require('node-bittrex-api');

bittrex.options({
    'apikey' : 'a',
    'apisecret' : 'a'
});

let buyPrice;
let sellPrice;
let lastPrice;
let currentPrice;

// bittrex.getbalances( function( data, err ) {
//     for (let currency of data.result) {
//         if (currency.Balance > 0)
//         console.log( currency );
//
//     }
// });

bittrex.getmarketsummary( { market : 'BTC-XLM'}, function( data, err ) {
    console.log( data );
    buyPrice = data.result[0].Last;
    sellPrice = buyPrice * 0.98;
});

setInterval(check, 10000);

function check() {
    bittrex.getticker( { market : 'BTC-XLM' }, function( data, err ) {
        currentPrice = data.result.Ask;

        if (currentPrice <= sellPrice) console.log("SELL at " + currentPrice + ' / ' +  getPercentage());

        if (currentPrice > buyPrice && currentPrice > lastPrice) {
            console.log("Up! Market now at : " + currentPrice.toFixed(5) + ' / ' +  getPercentage());
            sellPrice = currentPrice * 0.98;
        }

        if (currentPrice < lastPrice) {
            console.log("Down! Market now at : " + currentPrice.toFixed(5) + ' / ' +  getPercentage());
        }

        lastPrice = currentPrice;
    })
}

function getPercentage() {
    return (((currentPrice - buyPrice) / currentPrice) * 100).toFixed(2) + '%';
}