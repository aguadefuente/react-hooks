import { useEffect, useRef, useState } from 'react'
import * as ReactDOM from 'react-dom/client'
import VanillaTilt from 'vanilla-tilt'

interface HTMLVanillaTiltElement extends HTMLDivElement {
	vanillaTilt: VanillaTilt
}

function Tilt({
	children,
	max = 25,
	speed = 400,
	glare = true,
	maxGlare = 0.5,
}: {
	children: React.ReactNode
	max?: number
	speed?: number
	glare?: boolean
	maxGlare?: number
}) {
	const tiltRef = useRef<HTMLVanillaTiltElement>(null)

	const vanillaTiltOptions = {
		max,
		speed,
		glare,
		'max-glare': maxGlare,
	}

	useEffect(() => {
		const { current: tiltNode } = tiltRef
		if (tiltNode === null) return
		VanillaTilt.init(tiltNode, vanillaTiltOptions)
		return () => tiltNode.vanillaTilt.destroy()
		// 🐨 Add vanillaTiltOptions to fix the original bug
	}, [vanillaTiltOptions]) //Whenever values in the dependency array changes, React will call the returned cleanup function and then invoke the effect callback again

	return (
		<div ref={tiltRef} className="tilt-root">
			<div className="tilt-child">{children}</div>
		</div>
	)
}

function App() {
	const [count, setCount] = useState(0)
	const [options, setOptions] = useState({
		max: 25,
		speed: 400,
		glare: true,
		maxGlare: 0.5,
	})
	return (
		<div className="app">
			<form
				onSubmit={e => e.preventDefault()}
				onChange={event => {
					const formData = new FormData(event.currentTarget)
					setOptions({
						max: formData.get('max') as any,
						speed: formData.get('speed') as any,
						glare: formData.get('glare') === 'on',
						maxGlare: formData.get('maxGlare') as any,
					})
				}}
			>
				<div>
					<label htmlFor="max">Max:</label>
					<input id="max" name="max" type="number" defaultValue={25} />
				</div>
				<div>
					<label htmlFor="speed">Speed:</label>
					<input id="speed" name="speed" type="number" defaultValue={400} />
				</div>
				<div>
					<label>
						<input id="glare" name="glare" type="checkbox" defaultChecked />
						Glare
					</label>
				</div>
				<div>
					<label htmlFor="maxGlare">Max Glare:</label>
					<input
						id="maxGlare"
						name="maxGlare"
						type="number"
						defaultValue={0.5}
					/>
				</div>
			</form>
			<br />
			<Tilt {...options}>
				<div className="totally-centered">
					<button className="count-button" onClick={() => setCount(c => c + 1)}>
						{count}
					</button>
				</div>
			</Tilt>
		</div>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)

// 🤫 we'll fix this in the next step!
// (ALMOST) NEVER DISABLE THIS LINT RULE IN REAL LIFE!
/*
eslint
	react-hooks/exhaustive-deps: "off",
*/
