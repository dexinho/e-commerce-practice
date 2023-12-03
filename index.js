const productForm = document.querySelector('#product-form')
const uploadImageBtn = document.querySelector('#upload-image-btn')
const productImageInput = document.querySelector('#product-image-input')

productForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const formData = new FormData(e.target)
  console.log(formData)
  try {
    const response = await fetch('/addProduct', {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      console.log('Product added!')
    } else {
      console.log('Failed to add product')
    }
  } catch (err) {
    console.log(err)
  }
})

uploadImageBtn.addEventListener('click', () => {
  productImageInput.click()
  productImageInput.onchange = (e) => {
    console.log(e.target)
  }
})