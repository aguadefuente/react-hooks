import { useEffect, useState } from 'react'
import * as ReactDOM from 'react-dom/client'
import { generateGradient, getMatchingPosts } from '#shared/blog-posts'
import { setGlobalSearchParams } from '#shared/utils'

function getQueryParam() {
	const params = new URLSearchParams(window.location.search)
	return params.get('query') ?? ''
}

function App() {
	const [query, setQuery] = useState(getQueryParam)
	console.log('query', query)

	const words = query.split(' ') //return the query as array ["car", "dog"]
	console.log('words', words)

	const dogChecked = words.includes('dog') //true or false
	const catChecked = words.includes('cat')
	const caterpillarChecked = words.includes('caterpillar')

	// 🐨 add a useEffect(() => {}, []) call here (we'll talk about that empty array later)
	// 🐨 in the useEffect callback, subscribe to window's popstate event
	// 🐨 your event handler should call setQuery to getQueryParam()
	// 📜 https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
	useEffect(() => {
		window.addEventListener('popstate', () => setQuery(getQueryParam()))
	}, [])
	//para manejar el evento de cambio de historial (popstate),
	//que actualiza la consulta cuando cambia la URL
	///DOCUMENTACION:
	//https://developer.mozilla.org/en-US/docs/Web/API/History_API
	//https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event
	//https://www.w3schools.com/jsref/met_win_addeventlistener.asp

	function handleCheck(tag: string, checked: boolean) {
		const newWords = checked ? [...words, tag] : words.filter(w => w !== tag)
		setQuery(newWords.filter(Boolean).join(' ').trim())
	}

	return (
		<div className="app">
			<form
				onSubmit={e => {
					e.preventDefault()
					setGlobalSearchParams({ query })
				}}
			>
				<div>
					<label htmlFor="searchInput">Search:</label>
					<input
						id="searchInput"
						name="query"
						type="search"
						value={query}
						onChange={e => setQuery(e.currentTarget.value)}
					/>
				</div>
				<div>
					<label>
						<input
							type="checkbox"
							checked={dogChecked}
							onChange={e => handleCheck('dog', e.currentTarget.checked)}
						/>{' '}
						🐶 dog
					</label>
					<label>
						<input
							type="checkbox"
							checked={catChecked}
							onChange={e => handleCheck('cat', e.currentTarget.checked)}
						/>{' '}
						🐱 cat
					</label>
					<label>
						<input
							type="checkbox"
							checked={caterpillarChecked}
							onChange={e =>
								handleCheck('caterpillar', e.currentTarget.checked)
							}
						/>{' '}
						🐛 caterpillar
					</label>
				</div>
				<button type="submit">Submit</button>
			</form>
			<MatchingPosts query={query} />
		</div>
	)
}

function MatchingPosts({ query }: { query: string }) {
	const matchingPosts = getMatchingPosts(query)

	return (
		<ul className="post-list">
			{matchingPosts.map(post => (
				<li key={post.id}>
					<div
						className="post-image"
						style={{ background: generateGradient(post.id) }}
					/>
					<a
						href={post.id}
						onClick={event => {
							event.preventDefault()
							alert(`Great! Let's go to ${post.id}!`)
						}}
					>
						<h2>{post.title}</h2>
						<p>{post.description}</p>
					</a>
				</li>
			))}
		</ul>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)
