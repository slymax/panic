const exchanges = [];
const ccxt = require("ccxt");
const config = require("./config");
for (const exchange of config.exchanges) {
    exchanges.push({
        "name": exchange.name,
        "ccxt": new ccxt[exchange.name](exchange.keys),
        "targets": exchange.targets || config.targets,
        "minimums": {},
        "pairs": []
    });
}
for (const [index, value] of exchanges.entries()) {
    (async() => {
        await value.ccxt.fetchBalance().then(data => {
            exchanges[index].balances = data.free;
        }).catch(error => console.log(error));
        await value.ccxt.fetchMarkets().then(data => {
            data.forEach(pair => {
                exchanges[index].pairs.push(pair.symbol);
                exchanges[index].minimums[pair.symbol] = pair.limits.amount.min;
            });
        }).catch(error => console.log(error));
    })();
};
for (const exchange of exchanges) {
    const sold = [];
    for (symbol in exchange.balances) {
        exchange.targets.forEach(target => {
            exchange.pairs.forEach(pair => {
                if (sold.indexOf(symbol) < 0 && exchange.balances[symbol] > exchange.minimums[pair] && pair == `${symbol}/${target}`) {
                    console.log(`Exchanging ${exchange.balances[symbol]} ${symbol} for ${target} on ${exchange.name.toUpperCase()}`);
                    if (config.trade) {
                        exchange.ccxt.createMarketSellOrder(pair, exchange.balances[symbol]).catch(error => console.log(error));
                        sold.push(symbol);
                    }
                }
            });
        });
    };
}
