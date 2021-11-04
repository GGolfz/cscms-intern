import { useEffect } from 'react'
import TagManager from 'react-gtm-module'

const tagManagerArgs = {
	gtmId: 'G-ZFW0E4TCP5',
}

function MyApp({ Component, pageProps }) {
	useEffect(() => {
		TagManager.initialize(tagManagerArgs)
	}, [])
	return <Component {...pageProps} />
}

export default MyApp
