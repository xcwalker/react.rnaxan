// imports
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_AUTH_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_AUTH_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_AUTH_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_AUTH_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_AUTH_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth();
export var error = null;
const storage = getStorage();
const db = getFirestore(app);

export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            console.info("Logged In User (Email: " + email + ")")
        })
        .catch(err => {
            switch (err.code) {
                case 'auth/invalid-email':
                    error = 'Invalid Email';
                    break;

                case 'auth/invalid-password':
                    error = 'Invalid Password';
                    break;

                case 'auth/too-many-requests':
                    error = 'Too Many Requests - Reset Password';
                    break;

                default:
                    error = err.code;
                    break;
            }
        })
}

export function logout() {
    return signOut(auth)
        .then(() => {
            console.info("Logged Out User")
        })
        .catch(err => {
            error = err;
            console.error("Error Logging Out User" && err)
        })
}

export function forgot(email) {
    return sendPasswordResetEmail(auth, email)
        .then(() => {
            // Reset Email Sent
        })
        .catch(err => {
            switch (err.code) {
                case 'auth/user-not-found':
                    error = 'User Not Found';
                    break;

                case 'auth/too-many-requests':
                    error = 'Too Many Requests';
                    break;

                default:
                    error = err.code;
                    break;
            }
        })
}

// Custom Hook
export function useAuth(falseValue) {
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
        return unsub;
    }, [])

    if (currentUser === undefined && falseValue) { setCurrentUser(falseValue) }

    return currentUser;
}

export async function uploadImage(file, route, currentUser) {
    var type = "photo";

    const fileEXT = file.name.split(".").pop();
    if (fileEXT !== "jpg" && fileEXT !== "jpeg" && fileEXT !== "png" && fileEXT !== "apng" && "fileEXT" !== "webp" && fileEXT !== "webm" && fileEXT !== "gif" && fileEXT === "mp4") {
        console.error("Unsupported Format");
        alert("Unsupported Format")
        return
    }
    if (fileEXT === "webm" || fileEXT === "mp4") {
        type = "video";
    }
    const fileRef = ref(storage, route + "/" + currentUser.uid + '-' + Date.now() + file.name);
    await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);

    return photoURL
}

// storage
export async function getUserInfo(userID) {
    try {
        const docSnap = await getDoc(doc(db, "users", userID));
        return docSnap.data();
    } catch (e) {
        console.error("Error getting user: ", e);
    }
}

export async function getRecipe(ID, setLoading) {
    if (setLoading) setLoading(true)

    try {
        const docSnap = await getDoc(doc(db, "recipes", ID));
        if (setLoading) setLoading(false)
        return docSnap.data();
    } catch (e) {
        console.error("Error getting recipe (rE): ", e);
        if (setLoading) setLoading(false)
        return
    }
}

export async function createRecipe(recipeOBJ, recipeMainImage, recipeOtherImages, currentUser, setLoading) {
    var recipeHeaderImageLink;
    var recipeImagesArray = [];
    const date = new Date();

    await uploadImage(recipeMainImage, currentUser).then(res => {
        recipeHeaderImageLink = res;
    })

    for (let i = 0; recipeOtherImages.length > i; i++) {
        console.log(recipeOtherImages.item(i))
        await uploadImage(recipeOtherImages.item(i), currentUser).then(res => {
            recipeImagesArray.push(res);
        })
    }

    setLoading(true)
    try {
        const docSnap = await addDoc(collection(db, "recipes"), {
            about: recipeOBJ.about,
            ingredients: recipeOBJ.ingredients,
            instructions: recipeOBJ.instructions,
            images: {
                main: recipeHeaderImageLink,
                other: recipeImagesArray,
            },
            info: {
                author: currentUser.uid,
                createdAt: date.toJSON(),
            }
        });

        console.log("Document written with ID: ", docSnap.id);
        return docSnap.id
    } catch (e) {
        console.error("Error adding document: ", e);
    }
    setLoading(false);
}

export async function updateRecipe(recipeOBJ, recipeMainImage, recipeOtherImages, ID, currentUser) {
    var recipeHeaderImageLink;
    var recipeImagesArray = recipeOBJ.images.other;
    const date = new Date();

    if (recipeOBJ.images.main === "") {
        await uploadImage(recipeMainImage, currentUser).then(res => {
            recipeHeaderImageLink = res;
        })
    } else {
        recipeHeaderImageLink = recipeOBJ.images.main;
    }

    for (let i = 0; recipeOtherImages.length > i; i++) {
        console.log(recipeOtherImages.item(i))
        await uploadImage(recipeOtherImages.item(i), currentUser).then(res => {
            recipeImagesArray.push(res);
        })
    }

    await updateDoc(doc(db, "recipes", ID), {
        about: recipeOBJ.about,
        ingredients: recipeOBJ.ingredients,
        instructions: recipeOBJ.instructions,
        images: {
            main: recipeHeaderImageLink,
            other: recipeImagesArray,
        },
        info: {
            author: currentUser.uid,
            updatedAt: date.toJSON(),
        }
    }).then(() => {
        console.info("Recipe Updated", ID)
    }).catch(err => {
        console.error("Error Updating Recipe", err)
    })
}
export async function deleteRecipe(ID) {
    await deleteDoc(doc(db, "recipe", ID))
        .then(() => {
            console.info("Recipe Deleted", ID)
        })
        .catch(err => {
            console.error("Error Deleting Recipe", err)

        })
}