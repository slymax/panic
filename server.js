const exchanges = [];
const ccxt = require("ccxt");
const config = require("./config");
config.exchanges.forEach(exchange => {
    exchanges.push({
        "name": exchange.name,
        "ccxt": new ccxt[exchange.name](exchange.keys),
        "targets": exchange.targets || config.targets,
        "minimums": {},
        "pairs": []
    });
});
let remaining = exchanges.length * 2;
exchanges.forEach((exchange, index) => {
    (async() => {
        await exchange.ccxt.fetchBalance().then(data => {
            exchanges[index].balances = data.free;
            update();
        }).catch(error => console.log(error));
        await exchange.ccxt.fetchMarkets().then(data => {
            data.forEach(pair => {
                exchanges[index].pairs.push(pair.symbol);
                exchanges[index].minimums[pair.symbol] = pair.limits.amount.min;
            });
            update();
        }).catch(error => console.log(error));
    })();
});
function update() {
    remaining--;
    if (remaining == 0) exchanges.forEach(exchange => {
        let sold = [];
        Object.keys(exchange.balances).forEach(symbol => {
            exchange.targets.forEach(target => {
                exchange.pairs.forEach(pair => {
                    if (sold.indexOf(symbol) < 0 && exchange.balances[symbol] > exchange.minimums[pair] && pair == `${symbol}/${target}`) {
                        console.log(`Exchanging ${exchange.balances[symbol]} ${symbol} for ${target} on ${exchange.name.toUpperCase()}`);
                        if (config.trade) exchange.ccxt.createMarketSellOrder(pair, exchange.balances[symbol]).catch(error => console.log(error));
                        sold.push(symbol);
                    }
                });
            });
        });
    });
}