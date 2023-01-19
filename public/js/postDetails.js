// sending post
// --------------------------
const blogForm = document.querySelector("form");
let titleError = document.querySelector(".title.error");
let categoryError = document.querySelector(".category.error");
let moreError = document.querySelector(".more.error");
let stst = document.querySelector(".stts");

// blogForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   stst.style.color = "green";
//   stst.style.display = "block";
//   stst.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;
//   // Capturing values
//   const title = blogForm.title.value;
//   const description = blogForm.description.value;
//   titleError.textContent =
//     descriptionError.textContent =
//       "";
//   try {
//     const request = await fetch("/api/posts", {
//       method: "POST",
//       body: JSON.stringify({
//         title,
//         description
//       }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     const response = await request.json();
//     if (response.message) {
//       document.querySelector("#logsms").style.color = "green";
//       document.querySelector(
//         "#logsms"
//       ).innerHTML = `${response.message} close the modal`;
//       stst.innerHTML = `<i class="fa-solid fa-check"></i>`;
//       setTimeout(() => {
//         blogForm.title.value = "";
//         blogForm.description.value = "";
//         document.querySelector("#logsms").innerHTML = ``;
//       }, 5000);
//     }
//     if (response.errors) {
//       stst.style.display = "none";
//       titleError.textContent = response.errors.title;
//       categoryError.textContent = response.errors.category;
//       moreError.textContent = response.errors.content;
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });


// -----------------------------------------------------
// Fetching all Postss
// ----------------------------------------------------

async function fetchAllArticles() {
  try {
    const request = await fetch("/api/posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    return response.results;
  } catch (error) {
    console.log(error);
  }
}
async function fetchAllMessages() {
  try {
    const request = await fetch("api/message/allMessage", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    return response;
  } catch (error) {
    console.log(error);
  }
}
// async function fetchAllArticlesLikes(post) {
//   try {
//     const request = await fetch(`/getAllPostsLikes?post=${post}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     const response = await request.json();
//     return await response;
//   } catch (error) {
//     console.log(error);
//   }
// }
// async function fetchAllArticlesComment(post) {
//   try {
//     const request = await fetch(`/getAllComments?post=${post}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     const response = await request.json();
//     return await response;
//   } catch (error) {
//     console.log(error);
//   }
// }

