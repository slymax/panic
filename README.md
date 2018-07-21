Panic is a script to panic sell cryptocurrencies. Requires Node.js 8 or higher.

1.  [Download](https://github.com/slymax/panic/archive/master.zip) or clone this repository and run `npm install` to install dependencies.
2.  Open the `config.json` file and add the API keys for your exchanges.
3.  Run `npm start` to launch the script.

As long as the `trade` property in `config.json` is set to `false`, panic will only show you what transactions would be executed without actually placing any orders. If you set it to `true`, orders will be executed without prompting for confirmation.

In `config.json` you can also specify your target currencies. The default setting is `["EUR", "USD", "USDT", "BTC"]` which means that Panic will try to exchange each token for Euros first. If that pair is not available for trading on the exchange, it will try to exchange for USD, then for USDT, etc. I recommend leaving BTC as the final option so that if a token can't be directly exchanged for fiat, it will be exchanged for Bitcoin. You can then run the script again to exchange your remaining Bitcoins for fiat. You can also overwrite the global target setting for individual exchanges.

Panic is powered by [CCXT](https://github.com/ccxt/ccxt).
