import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";
// const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;
const clientId = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;

function App() {
	const [loading, setLoading] = useState(false);
	const [photos, setPhotos] = useState([]);
	const [page, setPage] = useState(1);
	const [input, setInput] = useState("");
	const [query, setQuery] = useState("red");
	const [querySelected, setQuerySelected] = useState(false);

	const fetchUrl = async () => {
		setLoading(true);
		let url;
		const urlPage = `&page=${page}`;
		const queryValue = `&query=${query}`;
		url = querySelected
			? `${searchUrl}${clientId}${queryValue}${urlPage}`
			: `${mainUrl}${clientId}${urlPage}`;
		try {
			const res = await fetch(url);
			const data = await res.json();
			setPhotos((photos) => {
				if (querySelected && page === 1) {
					return data.results;
				} else if (querySelected) {
					return [...photos, ...data.results];
				}
				return [...photos, ...data];
			});
			setLoading(false);
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	};

	const handleClick = (e) => {
		e.preventDefault();
		setQuerySelected(true);
		setPage(1);
		setQuery(input);
		setInput("");
	};

	useEffect(() => {
		fetchUrl();
	}, [page, query]);

	useEffect(() => {
		const event = window.addEventListener("scroll", () => {
			if (
				!loading &&
				Math.abs(
					window.innerHeight +
						window.pageYOffset -
						document.body.offsetHeight
				) <= 2
			) {
				setPage((page) => page + 1);
			}
		});
		return () => {
			window.removeEventListener("scroll", event);
		};
	}, []);

	return (
		<main>
			<section className="search">
				<form className="search-form">
					<input
						type="text"
						className="form-input"
						placeholder="search"
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
					<button
						className="submit-btn"
						type="submit"
						onClick={handleClick}
					>
						<FaSearch />
					</button>
				</form>
			</section>
			<section className="photos">
				<div className="photos-center">
					{photos.map((photo) => {
						return <Photo key={photo.id} {...photo} />;
					})}
				</div>
				{loading && <h2 className="loading">Loading...</h2>}
			</section>
		</main>
	);
}

export default App;
