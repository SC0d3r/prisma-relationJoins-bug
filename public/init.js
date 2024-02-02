document.addEventListener("DOMContentLoaded", () => {
  init()
})

function init() {
  const button = document.querySelector(".not-initialized div button")

  button.onclick = onClickButton;
}

async function onClickButton(e) {
  // const btn = e.target;
  const btn = document.querySelector(".not-initialized div button")

  const btnTxt = btn.querySelector(".btn-txt")
  btnTxt.style.visibility = "hidden"

  const loading = btn.querySelector(".loading")
  loading.style.display = "inline-flex"

  const res = await initData()

  // reset
  loading.style.display = "none"
  btnTxt.style.visibility = "visible"

  if (!res) {
    alert("initializing data failed (check console.logs)")
    return
  }

  btn.classList.add("disabled-btn")

  const initDataDiv = document.querySelector(".initialized")
  initDataDiv.style.display = "block"

  const bugPageDisabledLink = document.querySelector(".disabled")
  bugPageDisabledLink.classList.remove("disabled")
}

async function initData() {
  try {
    const res = await fetch("http://localhost:3000/init_data")
    const data = await res.json()
    return !!data.success
  } catch (e) {
    console.log("::ERROR while inititing Data", e)
    return false
  }
}