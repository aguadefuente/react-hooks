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

/* APUNTES TUTORIAL ANTERIOR (VER videos 46 al 51)
USE-EFFECT

//initialName prop tiene un default value
function Greeting({initialName = ""}){
	const [name, setName] = React.useState(
		window.localStorage.getItem("name") || initialName //el state será el default value ("") o el valor que se haya guardado en localStorage y agarre por eso el getItem para que ese valor persista. Si no tuviéramos esto cada vez que se refresca la pantalla el useEffect agregaría como valor de la key de localStorage nuevamente el default value "" (empty String)
	)

	//useEffect para sincronizar el state con nuestra localStorage
    React.useEffect(() => {
	window.localStorage.setItem("name", name) //agrega la key name y su valor será un empty string (default value) o el que hayamos ingresado en el input
    })

	function handleChange(event){
		setName(event.target.value)
	}

	return (
		<div>
		  <form>
		    <label htmlFor="name">Name:</label>
			//el value es el que hace al input controlled
			<input value={name} id="name" onChange={handleChange}></input>
		  </form>
		</div>
	)

}

function App(){
	return <Greeting initialName="George"/>
}
})

//LAZY STATE INITIALIZATION (video 47)
Según el ejemplo anterior cada vez que la aplicación arranca ésta va a leer
el localStorage, en cada re-render. 
Eso puede generar un problema de performance, hace lenta la aplicación.
En realidad sólo necesitamos saber el valor del localStorage cuando la aplicación se renderize por primera vez

Para mejorar eso, useState nos permite pasarle funciones en vez de un solo valor
y esto haría que se llame a localStorage solo la primera vez que la aplicación se renderice
eg) React.useState(someexpensivecomputacion())
    React.useState(() => someexpensivecomputation())

Entonces en nuestra aplicación el useState en vez de:
	const [name, setName] = React.useState(
		window.localStorage.getItem("name") || initialName 
	)

	sería:
	const [name, setName] = React.useState(
		() => window.localStorage.getItem("name") || initialName
	)
	
//USEEFFECT DEPENDENCY (video 48)

React.useEffect(() => {
	window.localStorage.setItem("name", name) //agrega la key name y su valor será un empty string (default value) o el que hayamos ingresado en el input
},[name])

- sólo useEffect sincronizará cuando cambie el state name

//CUSTOM HOOK( ver directamente video 49, 50)
//REACT HOOK FLOW DIAGRAM (video 51)
*/
