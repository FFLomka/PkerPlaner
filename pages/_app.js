import "antd/dist/antd.css"

import "../styles/globals.css"

import Head from "next/head"
import {Provider} from "react-redux"

import store from "../core/redux"

function MyApp({Component, pageProps, router}) {
	return (
		<div>
			<Provider store={store}>
				<Head>
					<title>{Component.title ? `${Component.title} | ` : ""}App</title>
				</Head>
				<Component {...pageProps} />
			</Provider>
		</div>
	)
}

export default MyApp
