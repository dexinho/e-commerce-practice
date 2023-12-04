const formContainer = document.querySelector("#form-container");
const productForm = document.querySelector("#product-form");
const uploadImageBtn = document.querySelector("#upload-image-btn");
const productImageInput = document.querySelector("#product-image-input");
const deleteConfirmationDialog = document.querySelector(
  "#delete-confirmation-dialog"
);
const deleteConfirmationBtns = document.querySelectorAll(
  ".delete-confirmation-btns"
);
const addNewProductBtn = document.querySelector("#add-new-product-btn");
const productsContainer = document.createElement("div");
const productDisplayDiv = document.createElement("div");

productDisplayDiv.id = "product-display-div";
document.body.append(productsContainer);

productsContainer.append(productDisplayDiv);

const addProductListener = (_addNewProductBtn) => {
  _addNewProductBtn.addEventListener("click", () => {
    productsContainer.style.display = "none";
    formContainer.style.display = "flex";
  });
};

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  console.log(formData)

  try {
    const response = await fetch("/addProduct", {
      method: "POST",
      body: formData,
    });

    productsContainer.style.display = "flex";
    formContainer.style.display = "none";

    getProducts()

    if (response.ok) {
      console.log("Product added!");
    } else {
      console.log("Failed to add product");
    }
  } catch (err) {
    console.log(err);
  }
});

const removeProduct = async (id) => {
  const response = await fetch(`/removeProduct?productID=${id}`);
  const updatedProducts = await response.json();

  displayProducts(updatedProducts);
  deleteConfirmationDialog.close();
};

const trashListener = (faTrashCan) => {
  faTrashCan.addEventListener("click", () => {
    deleteConfirmationDialog.showModal();

    const confirmationListener = (event) => {
      if (event.target.textContent === "YES") {
        removeProduct(faTrashCan.id);
      }
      deleteConfirmationDialog.close();

      deleteConfirmationBtns.forEach((button) =>
        button.removeEventListener("click", confirmationListener)
      );
    };

    deleteConfirmationBtns.forEach((button) =>
      button.addEventListener("click", confirmationListener, { once: true })
    );
  });
};

const sortBySelectListener = (_sortBySelect) => {
  _sortBySelect.addEventListener("change", async () => {
    if (_sortBySelect === "Sort by") return;

    const response = await fetch(`/getProducts?sortBy=${_sortBySelect.value}`);
    const updatedProducts = await response.json();

    displayProducts(updatedProducts);
  });
};

const searchBarListener = (_searchBarInput) => {
  _searchBarInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      const response = await fetch(
        `/getProducts?search=${_searchBarInput.value}`
      );
      const filteredProducts = await response.json();
      displayProducts(filteredProducts);
    }
  });
};

const displayUserTools = () => {
  const eCommerceTitle = document.createElement("div");
  const sortBySelect = document.createElement("select");
  const addNewProductBtn = document.createElement("button");
  const sortBy = document.createElement("option");
  const priceHigh = document.createElement("option");
  const priceLow = document.createElement("option");
  const searchBarDiv = document.createElement("div");
  const searchBarInput = document.createElement("input");
  const sortAndAddDiv = document.createElement("div");

  sortBy.value = "Sort by";
  priceHigh.value = "Price high";
  priceLow.value = "Price low";
  sortBy.textContent = "Sort by";
  priceHigh.textContent = "Price high";
  priceLow.textContent = "Price low";
  addNewProductBtn.textContent = "ADD PRODUCT";
  eCommerceTitle.textContent = "E-COMMERCE";

  productsContainer.id = "products-container";
  sortAndAddDiv.id = "sort-and-add-div";
  sortBySelect.id = "sort-by-select";
  addNewProductBtn.id = "add-new-product-btn";
  eCommerceTitle.id = "e-commerce-title";
  searchBarDiv.id = "search-bar-div";
  searchBarInput.id = "search-bar-input";
  searchBarInput.placeholder = "search";

  productsContainer.prepend(eCommerceTitle, sortAndAddDiv, searchBarDiv);
  searchBarDiv.append(searchBarInput);
  sortAndAddDiv.append(sortBySelect);
  sortAndAddDiv.append(addNewProductBtn);
  sortBySelect.append(sortBy);
  sortBySelect.append(priceHigh);
  sortBySelect.append(priceLow);

  sortBySelectListener(sortBySelect);
  searchBarListener(searchBarInput);
  addProductListener(addNewProductBtn);
};

displayUserTools();

const displayProducts = (products) => {
  productDisplayDiv.textContent = "";

  if (products.length === 0) {
    const noProducts = document.createElement("div");
    noProducts.textContent = "No products to show.";
    productDisplayDiv.append(noProducts);
    return;
  }

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
    productPriceDiv.textContent = product.price + "$";
    productDescriptionDiv.textContent = product.description;
    productImage.src = product.imageSrc;

    productSlot.className = "product-slot";
    removeItem.className = "remove-item";
    productNameDiv.className = "product-details product-name-div";
    productPriceDiv.className = "product-details product-price-div";
    productImageDiv.className = "product-details product-image-div";
    productDescriptionDiv.className = "product-details product-description-div";
    faTrashCan.className = "fa-solid fa-trash-can";
    faTrashCan.id = product.id;
    trashListener(faTrashCan);

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

async function getProducts() {
  const response = await fetch(`./getProducts`);
  const products = await response.json();

  displayProducts(products);
}

getProducts();
