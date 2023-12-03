const productForm = document.querySelector("#product-form");
const uploadImageBtn = document.querySelector("#upload-image-btn");
const productImageInput = document.querySelector("#product-image-input");
const productsContainer = document.createElement("div");
productsContainer.id = "products-container";

const PRODUCTS = [
  {
    name: "Bicycle",
    price: 250,
    description: "Nice black bicycle",
    image: "./assets/images/black_bicycle.jpg",
  },
  {
    name: "Backpack",
    price: 150,
    description: "Amazing gray backpack",
    image: "./assets/images/gray_backpack.jpg",
  },
  {
    name: "Headphones",
    price: 50,
    description: "Wonderful black headphones",
    image: "./assets/images/black_headphones.jpg",
  },
];

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  console.log(formData);
  try {
    const response = await fetch("/addProduct", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("Product added!");
    } else {
      console.log("Failed to add product");
    }
  } catch (err) {
    console.log(err);
  }
});

uploadImageBtn.addEventListener("click", () => {
  productImageInput.click();
  productImageInput.onchange = (e) => {
    console.log(e.target);
  };
});

const displayProducts = (products) => {
  const productDisplayDiv = document.createElement("div");
  const eCommerceTitle = document.createElement("div");

  productDisplayDiv.id = "product-display-div";
  eCommerceTitle.id = "e-commerce-title";
  eCommerceTitle.textContent = "E-COMMERCE";

  document.body.append(productsContainer);

  products.forEach((product) => {
    const productSlot = document.createElement("div");
    const removeItem = document.createElement("div");
    const productNameDiv = document.createElement("div");
    const productPriceDiv = document.createElement("div");
    const productDescriptionDiv = document.createElement("div");
    const productImageDiv = document.createElement("div");
    const productImage = document.createElement("img");
    const faTrashCan = document.createElement("i");

    productNameDiv.textContent = product.name;
    productPriceDiv.textContent = product.price;
    productDescriptionDiv.textContent = product.description;
    productImage.src = product.image;

    productSlot.className = "product-slot";
    removeItem.className = "remove-item";
    productNameDiv.className = "product-details product-name-div";
    productPriceDiv.className = "product-details product-price-div";
    productImageDiv.className = "product-details product-image-div";
    productDescriptionDiv.className = "product-details product-description-div";
    faTrashCan.className = "fa-solid fa-trash-can";

    productsContainer.append(eCommerceTitle, productDisplayDiv);
    productDisplayDiv.append(productSlot);
    productSlot.append(
      removeItem,
      productNameDiv,
      productPriceDiv,
      productImageDiv,
      productDescriptionDiv
    );
    removeItem.append(faTrashCan);
    productImageDiv.append(productImage);
  });
};

displayProducts(PRODUCTS);
