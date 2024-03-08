import * as ReactDOM from 'react-dom/client'
import { generateGradient, getMatchingPosts } from '#shared/blog-posts'
import { useState } from 'react'

function App() {
	// 🐨 call useState here and initialize the query with an empty string
	const [query, setQuery] = useState('')
	/*
	function handleQuery(e) {
     setQuery(e.currentTarget.value)
	}*/

	function handleQuery(e: React.ChangeEvent<HTMLInputElement>) {
		setQuery(e.currentTarget.value)
	}

	// const handleQuery: React.ChangeEventHandler<HTMLInputElement> = (e) {
	// 	setQuery(e.currentTarget.value)
	// }

	return (
		<div className="app">
			<form>
				<div>
					<label htmlFor="searchInput">Search:</label>
					<input
						id="searchInput"
						name="query"
						type="search"
						// 🐨 add an onChange handler here that calls setQuery with the event.currentTarget.value
						/*onChange={e => handleQuery(e.currentTarget.value)} */ //así está en el archivo de la solución
						onChange={handleQuery} //elegí este modo para probar hacer la función fuera
					/>
				</div>
				<div>
					<label>
						<input type="checkbox" /> 🐶 dog
					</label>
					<label>
						<input type="checkbox" /> 🐱 cat
					</label>
					<label>
						<input type="checkbox" /> 🐛 caterpillar
					</label>
				</div>
				<button type="submit">Submit</button>
			</form>
			{/* 🐨 pass the query state as a prop */}
			<MatchingPosts /*query=""*/ query={query} />
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
