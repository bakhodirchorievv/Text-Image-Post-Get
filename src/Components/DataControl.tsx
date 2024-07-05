import "../App.css";
import Auth from "../Components/auth";
import { db, auth, storage } from "../Config/Firebase";
import { useEffect, useState } from "react";
import {
	getDocs,
	collection,
	addDoc,
	deleteDoc,
	updateDoc,
	doc,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import {
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";

interface Movie {
	id: string;
	title: string;
	releaseDate: number;
	receivedAnOscar: boolean;
	imageUrl: string;
	userId?: string;
}

const DataControl = () => {
	const [movieList, setMovieList] = useState<Movie[]>([]);

	//new movie states
	const [newMovieTitle, setNewMovieTitle] = useState("");
	const [newReleaseDate, setNewReleaseDate] = useState(0);
	const [updatedRelease, setUpdatedRelease] = useState(0);
	const [isMovieOscar, setIsMovieOscar] = useState(false);
	const [updatedTitle, setUpdatedTitle] = useState("");
	const [userEmail, setUserEmail] = useState<string | null>(null);
	const [newMovieImage, setNewMovieImage] = useState<File | null>(null);
	const [updatedImage, setUpdatedImage] = useState<File | null>(null);

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

		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setUserEmail(user.email);
			} else {
				setUserEmail(null);
			}
		});

		return () => unsubscribe();
	}, []);

	const onSubmitMovie = async () => {
		if (newMovieImage) {
			const imageRef = ref(storage, `images/${newMovieImage.name}`);
			await uploadBytes(imageRef, newMovieImage);
			const imageUrl = await getDownloadURL(imageRef);

			try {
				await addDoc(moviesCollectionRef, {
					title: newMovieTitle,
					releaseDate: newReleaseDate,
					receivedAnOscar: isMovieOscar,
					imageUrl: imageUrl,
					userId: auth?.currentUser?.uid,
				});

				getMovieList();
			} catch (error) {
				console.error(error);
			}
		} else {
			console.error("No image selected");
		}
	};

	const deleteMovie = async (id: string, imageUrl: string) => {
		try {
			const movieDoc = doc(db, "movies", id);
			await deleteDoc(movieDoc);

			if (imageUrl) {
				const imageRef = ref(storage, imageUrl);
				try {
					await deleteObject(imageRef);
					console.log("Image deleted successfully");
				} catch (imageError) {
					console.error("Error deleting image: ", imageError);
				}
			}

			getMovieList();
			console.log("Movie and image deleted");
		} catch (error) {
			console.error("Error deleting movie or image: ", error);
		}
	};

	const onUpdateTitle = async (id: string) => {
		try {
			const movieDoc = doc(db, "movies", id);
			await updateDoc(movieDoc, { title: updatedTitle });
			getMovieList();
			console.log("Movie updated");
		} catch (error) {
			console.error("while updating title", error);
		}
	};

	const onUpdateImage = async (id: string, currentImageUrl: string) => {
		if (updatedImage) {
			const imageRef = ref(storage, `images/${updatedImage.name}`);
			await uploadBytes(imageRef, updatedImage);
			const imageUrl = await getDownloadURL(imageRef);

			const movieDoc = doc(db, "movies", id);

			// Delete the old image from Firebase Storage if it exists
			if (currentImageUrl) {
				const oldImageRef = ref(storage, currentImageUrl);
				await deleteObject(oldImageRef);
			}

			await updateDoc(movieDoc, { imageUrl });
			getMovieList();
			console.log("Image updated");
		} else {
			console.error("No image selected for update");
		}
	};

	const onDeleteImage = async (id: string, imageUrl: string) => {
		const imageRef = ref(storage, imageUrl);

		try {
			await deleteObject(imageRef);

			const movieDoc = doc(db, "movies", id);
			await updateDoc(movieDoc, { imageUrl: "" });

			getMovieList();
			console.log("Image deleted");
		} catch (error) {
			console.error("Error deleting image: ", error);
		}
	};

	const onUpDateReleaseDate = async (id: string) => {
		try {
			const movieDoc = doc(db, "movies", id);
			await updateDoc(movieDoc, { releaseDate: updatedRelease });
			getMovieList();
			console.log("Movie date updated");
		} catch (error) {
			console.error("while updating release date", error);
		}
	};

	return (
		<div className="ControlData">
			<Auth />

			{userEmail && (
				<div className="controlAuthWrapper">
					<input
						type="text"
						placeholder="Movie title..."
						onChange={(e) => setNewMovieTitle(e.target.value)}
					/>
					<input
						type="number"
						placeholder="Release date..."
						onChange={(e) => setNewReleaseDate(Number(e.target.value))}
					/>
					<input
						type="checkbox"
						checked={isMovieOscar}
						id="Oscar"
						onChange={(e) => setIsMovieOscar(e.target.checked)}
					/>
					<label htmlFor="Oscar">Received an Oscar</label>

					<input
						type="file"
						onChange={(e) =>
							setNewMovieImage(e.target.files ? e.target.files[0] : null)
						}
					/>

					<button onClick={onSubmitMovie}>Submit Movie</button>
				</div>
			)}

			<div className="controlDataWrapper">
				{movieList.map((movie) => (
					<div key={movie.id}>
						{userEmail && (
							<>
								<h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
									{movie.title}
								</h1>
								<p>Date: {movie.releaseDate}</p>
								{movie.imageUrl && (
									<img src={movie.imageUrl} alt={movie.title} width="500" />
								)}

								<button onClick={() => deleteMovie(movie.id, movie.imageUrl)}>
									Delete Movie
								</button>
								<input
									onChange={(e) => setUpdatedTitle(e.target.value)}
									type="text"
									placeholder="new title..."
								/>
								<button onClick={() => onUpdateTitle(movie.id)}>
									Update Title
								</button>
								<br />
								<input
									type="file"
									onChange={(e) =>
										setUpdatedImage(e.target.files ? e.target.files[0] : null)
									}
								/>
								<button onClick={() => onUpdateImage(movie.id, movie.imageUrl)}>
									Update Image
								</button>
								<button onClick={() => onDeleteImage(movie.id, movie.imageUrl)}>
									Delete Image
								</button>
								<br />
								<input
									type="text"
									onChange={(e) => setUpdatedRelease(Number(e.target.value))}
									placeholder="new release date..."
								/>
								<button onClick={() => onUpDateReleaseDate(movie.id)}>
									Update Release Date
								</button>
							</>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default DataControl;
