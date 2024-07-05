import { Link } from "react-router-dom";
import { db } from "../Config/Firebase";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import "./Cases.css";

interface Movie {
	id: string;
	title: string;
	releaseDate: number;
	receivedAnOscar: boolean;
	imageUrl: string;
	userId?: string;
}

const Cases = () => {
	const [movieList, setMovieList] = useState<Movie[]>([]);

	const moviesCollectionRef = collection(db, "movies");

	const getMovieList = async () => {
		try {
			const data = await getDocs(moviesCollectionRef);
			const filteredData: Movie[] = data.docs.map((doc) => ({
				...(doc.data() as Omit<Movie, "id">),
				id: doc.id,
			}));
			setMovieList(filteredData);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getMovieList();
	}, []);
	console.log(movieList);

	return (
		<div>
			<div className="cases-wrapper">
				<h2 className="case-title getBlock overallTitle topTitle">Кейсы</h2>
				<div className="case-left">
					{movieList.slice(0, 3).map((movie, index) => (
						<div
							className={`left-case-item ${index === 2 ? "bigger" : ""}`}
							key={movie.id}
						>
							<div
								className="whiteBack"
								style={{ backgroundImage: `url(${movie.imageUrl})` }}
							></div>
							<h3 className="caseTitle">{movie.title || "Valor"}</h3>
							<p className="case-desc">
								{" "}
								{movie.releaseDate || "Ювелирные изделия"}
							</p>
							<div className="caseBtnWrapper">
								<button className="overallBtn caseBtn">Логотип</button>
								<button className="overallBtn caseBtn">Брендинг</button>
								<button className="overallBtn caseBtn">Сайт</button>
							</div>
						</div>
					))}

					{/* <div className="left-case-item">
						<div className="whiteBack"></div>
						<h3 className="caseTitle">Valor</h3>
						<p className="case-desc">Ювелирные изделия</p>
						<div className="caseBtnWrapper">
							<button className="overallBtn caseBtn">Логотип</button>

							<button className="overallBtn caseBtn">Брендинг</button>
							<button className="overallBtn caseBtn">Сайт</button>
						</div>
					</div>
					<div className="left-case-item">
						<div className="whiteBack"></div>
						<h3 className="caseTitle">Valor</h3>
						<p className="case-desc">Ювелирные изделия</p>
						<div className="caseBtnWrapper">
							<button className="overallBtn caseBtn">Логотип</button>
							<button className="overallBtn caseBtn">Брендинг</button>
							<button className="overallBtn caseBtn">Сайт</button>
						</div>
					</div>
					<div className="left-case-item bigger">
						<div className="whiteBack"></div>
						<h3 className="caseTitle ">Valor</h3>
						<p className="case-desc">Ювелирные изделия</p>
						<div className="caseBtnWrapper">
							<button className="overallBtn caseBtn">Логотип</button>
							<button className="overallBtn caseBtn">Брендинг</button>
							<button className="overallBtn caseBtn">Сайт</button>
						</div>
					</div> */}
				</div>

				<div className="case-right">
					<h2 className="case-title getNone overallTitle">Кейсы</h2>

					{movieList.slice(3).map((movie, index) => (
						<div
							className={`left-case-item ${index === 0 ? "bigger" : ""}`}
							key={movie.id}
						>
							<div
								className="whiteBack"
								style={{ backgroundImage: `url(${movie.imageUrl})` }}
							></div>
							<h3 className="caseTitle">{movie.title || "Valor"}</h3>
							<p className="case-desc">
								{" "}
								{movie.releaseDate || "Ювелирные изделия"}
							</p>
							<div className="caseBtnWrapper">
								<button className="overallBtn caseBtn">Логотип</button>
								<button className="overallBtn caseBtn">Брендинг</button>
								<button className="overallBtn caseBtn">Сайт</button>
							</div>
						</div>
					))}

					{/* <div className="right-case-item bigger getNone">
						<div className="whiteBackRight"></div>
						<h3 className="caseTitle alignToRight">Valor</h3>
						<p className="case-desc alignToRight">Сервис аренды недвижимости</p>
						<div className="caseBtnWrapper flexEnd">
							<button className="overallBtn caseBtn">Логотип</button>
							<button className="overallBtn caseBtn">Брендинг</button>
							<button className="overallBtn caseBtn">Сайт</button>
						</div>
					</div>
					<div className="right-case-item">
						<div className="whiteBackRight"></div>
						<h3 className="caseTitle">Valor</h3>
						<p className="case-desc">Ювелирные изделия</p>
						<div className="caseBtnWrapper">
							<button className="overallBtn caseBtn">Логотип</button>
							<button className="overallBtn caseBtn">Брендинг</button>
							<button className="overallBtn caseBtn">Сайт</button>
						</div>
					</div> */}
					<Link to={"/DataControl"}>
						<button className="overallBtn moreCaseBtn ">Control Data</button>
					</Link>
				</div>
				<img
					src="/business-strategy-project/MainPage/bckg-layer.png"
					alt=""
					className="bckg-layer getNone"
				/>
			</div>
		</div>
	);
};

export default Cases;
