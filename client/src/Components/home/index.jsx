import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import image from "../../assets/image.png";
import image2 from "../../assets/image2.png";
import image3 from "../../assets/image3.png";
import image4 from "../../assets/image4.png";
import image5 from "../../assets/image5.png";
import image6 from "../../assets/image6.png";
import image8 from "../../assets/image8.png";
import image10 from "../../assets/image10.png";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import {
  changeSearchItem,
  changeSelectedCategory,
  setStatus,
  fetchProducts,
  addToCartAndSync,
  increaseQuantityAndSync,
  decreaseQuantityAndSync,
  removeFromCartAndSync,
  clearCartAndSync,
} from "../../redux/slices/homeSlice";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Drawer } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// If the API fails to fetch data, then categories and productCategories will be used as fallbacks.
const categories = [
  "Message Therapy",
  "Hair Cut, Wash & Style",
  "Nail Bar",
  "Manicure & Pedicure",
];

const productCategories = [
  {
    id: 1,
    name: "Trillion Protein Transfusion",
    image: image,
    category: "Message Therapy",
  },
  {
    id: 2,
    name: "TIRTIR Mask Fit Red Cushion",
    image: image2,
    category: "Hair Cut, Wash & Style",
  },
  {
    id: 3,
    name: "Kay Beauty Hydrating Foundation",
    image: image3,
    category: "Message Therapy",
  },
  {
    id: 4,
    name: "Suroskie My Glow All-In-One Tinted Moisturizer with SPF 30",
    image: image4,
    category: "Message Therapy",
  },
  {
    id: 5,
    name: "L'Oreal Professionnel Paris Majirel - 4 Brown 50 ml",
    image: image5,
    category: "Hair Cut, Wash & Style",
  },
  {
    id: 6,
    name: "L’Oreal Professionnel Hair Spa Repairing Cream bath (490gm)",
    image: image6,
    category: "Manicure & Pedicure",
  },
  {
    id: 7,
    name: "L'Oreal Professionnel Paris Majirel - 4 Brown 50 ml",
    image: image5,
    category: "Message Therapy",
  },
  {
    id: 8,
    name: "L’Oreal Professionnel Hydrating Concentrate Hair Spa for Dry & sensitive scalp (8ml x 6)",
    image: image8,
    category: "Message Therapy",
  },
  {
    id: 9,
    name: "Suroskie My Glow All-In-One Tinted Moisturizer with SPF 30",
    image: image4,
    category: "Message Therapy",
  },
  {
    id: 10,
    name: "L'Oreal Professionnel Density Advanced Shampoo for Anti-Hair Loss 300ml",
    image: image10,
    category: "Message Therapy",
  },
  {
    id: 11,
    name: "Trillion Protein Transfusion",
    image: image,
    category: "Hair Cut, Wash & Style",
  },
  {
    id: 12,
    name: "TIRTIR Mask Fit Red Cushion",
    image: image2,
    category: "Message Therapy",
  },
  {
    id: 13,
    name: "Kay Beauty Hydrating Foundation",
    image: image3,
    category: "Message Therapy",
  },
  {
    id: 14,
    name: "Suroskie My Glow All-In-One Tinted Moisturizer with SPF 30",
    image: image4,
    category: "Message Therapy",
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    searchItem,
    selectedStatus,
    selectedCategory,
    items: cartItems,
    products,
    status,
    error,
    cartStatus,
    cartError,
  } = useSelector((state) => state.home);
  const [hoveredId, setHoveredId] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleSearchItemChange = (e) => {
    dispatch(changeSearchItem(e.target.value));
  };

  const sourceProducts = products?.length > 0 ? products : productCategories;
  const normalizedSearch = (searchItem || "").trim().toLowerCase();
  const filteredProducts = sourceProducts.filter(
    (product) =>
      product.category === selectedCategory &&
      (!normalizedSearch ||
        (product.name || "").toLowerCase().includes(normalizedSearch))
  );

  return (
    <>
      <Grid container p={3} spacing={2}>
        <Grid size={12} display="flex" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600}>
            Products
          </Typography>
          <IconButton
            size="small"
            sx={{
              background: "#6C5DD3",
              background:
                "linear-gradient(90deg,rgba(108, 93, 211, 1) 0%, rgba(191, 166, 255, 1) 100%)",
              color: "white",
              mr: 2,
            }}
            onClick={() => navigate("/billing")}
          >
            <ShoppingCartIcon />
          </IconButton>
        </Grid>

        <Grid
          size={12}
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          rowGap={1}
          justifyContent="space-between"
        >
          <TextField
            id="search-bar"
            variant="outlined"
            size="small"
            value={searchItem}
            onChange={handleSearchItemChange}
            placeholder="Search for Product !"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                borderRadius: "10px",
                "& fieldset": {
                  borderRadius: "10px",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#64748B",
                  borderWidth: "1px",
                },
              },
            }}
          />
          <FormControl sx={{ minWidth: 100, mr: 2 }} size="small">
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={selectedStatus}
              onChange={(e) => dispatch(setStatus(e.target.value))}
              autoWidth
              size="small"
              sx={{
                backgroundColor: "white",
                borderRadius: "10px",
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#64748B",
                  borderWidth: "1px",
                },
              }}
              input={
                <OutlinedInput
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterAltOutlinedIcon />
                    </InputAdornment>
                  }
                />
              }
            >
              <MenuItem value={"All status"}>All status</MenuItem>
              <MenuItem value={20}>Available Products</MenuItem>
              <MenuItem value={21}>Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={12} display="flex" gap={1} flexWrap="wrap">
          {categories.map((category, index) => (
            <Button
              variant="outlined"
              size="small"
              sx={{
                textTransform: "none",
                borderRadius: "50px",
                color: selectedCategory === category ? "#fff" : "#000",
                borderColor: "#000",
                backgroundColor:
                  selectedCategory === category ? "#000" : "#fff",
                "&:hover": {
                  backgroundColor:
                    selectedCategory === category ? "#000" : "#f0f0f0",
                  borderColor: "#000",
                },
              }}
              key={index}
              onClick={() => dispatch(changeSelectedCategory(category))}
            >
              {category}
            </Button>
          ))}
        </Grid>

        {status === "loading" && (
          <Backdrop sx={{ color: "#fff" }}>
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        {status === "failed" && (
          <Typography variant="body2" color="error">
            Failed to load: {error}
          </Typography>
        )}
        {status === "succeeded" && (
          <Grid
            size={cartItems.length > 0 ? 8 : 12}
            display="flex"
            flexWrap="wrap"
            gap={1.5}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Grid
                  size={{ xs: 12, sm: 4, md: 2 }}
                  key={product.id}
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Box
                    sx={{
                      height: "50vh",
                      overflowY: "auto",
                      boxShadow: 3,
                      borderRadius: 2,
                      p: 1,
                      backgroundColor: "#fff",
                      textAlign: "center",
                      height: "160px",
                      position: "relative",
                      // overflow: "visible",
                    }}
                  >
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{
                        width: "88px",
                        height: "100px",
                        objectFit: "contain",
                        mx: "auto",
                        display: "block",
                      }}
                    />
                    <Tooltip title={product.name}>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        mt={1}
                        sx={{
                          display: "-webkit-box",
                          overflow: "hidden",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          textOverflow: "ellipsis",
                          cursor: "pointer",
                        }}
                      >
                        {product.name}
                      </Typography>
                    </Tooltip>

                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        backgroundColor: "#000",
                        color: "#fff",
                        zIndex: 10,
                        "&:hover": { backgroundColor: "#333" },
                        display:
                          hoveredId === product.id
                            ? "flex"
                            : { xs: "flex", md: "none" },
                      }}
                      onClick={() => {
                        dispatch(addToCartAndSync(product));
                        if (window.innerWidth < 600) {
                          setIsCartOpen(true);
                        }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Grid>
              ))
            ) : (
              <Grid size={12} textAlign="center" mt={5}>
                <Typography variant="h6" color="text.secondary">
                  No products found
                </Typography>
              </Grid>
            )}
          </Grid>
        )}

        {/* cart */}
        {cartItems.length > 0 && (
          <Grid size={4} display={{ xs: "none", md: "block" }}>
            <Box
              sx={{
                height: "50vh",
                overflowY: "auto",
                boxShadow: 3,
                borderRadius: 2,
                p: 2,
                mb: 2,
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  Product Cart
                </Typography>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => dispatch(clearCartAndSync())}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              {cartStatus === "loading" && (
                <Typography variant="body2" color="text.secondary">
                  Syncing cart...
                </Typography>
              )}
              {cartStatus === "failed" && (
                <Typography variant="body2" color="error">
                  Cart sync failed: {cartError}
                </Typography>
              )}

              {/* Cart Items */}
              {cartItems.length > 0 &&
                cartItems.map((item) => (
                  <Box key={item.id} mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: "60px",
                          height: "60px",
                          objectFit: "contain",
                        }}
                      />
                      <Box flex={1}>
                        <Typography variant="body2" fontWeight={500}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ₹{item.price || "NA"}
                        </Typography>
                      </Box>

                      {/* Quantity controls */}
                      <Box display="flex" alignItems="center" gap={1}>
                        <Button
                          size="small"
                          sx={{
                            height: "32px",
                            minWidth: "32px",
                            padding: 0,
                            color: "#000",
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                          }}
                          onClick={() =>
                            dispatch(decreaseQuantityAndSync(item.id))
                          }
                        >
                          <RemoveIcon />
                        </Button>
                        <Typography>{item.quantity}</Typography>
                        <Button
                          size="small"
                          sx={{
                            height: "32px",
                            minWidth: "32px",
                            padding: 0,
                            backgroundColor: "#6C5DD3",
                            color: "#fff",
                            borderRadius: "10px",
                          }}
                          onClick={() =>
                            dispatch(increaseQuantityAndSync(item.id))
                          }
                        >
                          <AddIcon />
                        </Button>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                  </Box>
                ))}
              {cartItems.length > 0 && (
                <Button
                  variant="contained"
                  sx={{
                    mt: "auto",
                    borderRadius: "10px",
                    fontWeight: 600,
                    background: "#6C5DD3",
                    background:
                      "linear-gradient(90deg,rgba(108, 93, 211, 1) 0%, rgba(191, 166, 255, 1) 100%)",
                  }}
                  fullWidth
                  onClick={() => navigate("/billing")}
                >
                  Checkout
                </Button>
              )}
            </Box>
          </Grid>
        )}
      </Grid>

      {/* cart drawer for small devices */}
      <Drawer
        anchor="right"
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <Box
          sx={{
            width: 300,
            p: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Product Cart
            </Typography>
            <IconButton
              size="small"
              color="error"
              onClick={() => dispatch(clearCartAndSync())}
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <Box key={item.id} mb={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{
                      width: "60px",
                      height: "60px",
                      objectFit: "contain",
                    }}
                  />
                  <Box flex={1}>
                    <Typography variant="body2" fontWeight={500}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹{item.price || "NA"}
                    </Typography>
                  </Box>

                  {/* Quantity controls */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <Button
                      size="small"
                      sx={{
                        height: "32px",
                        minWidth: "32px",
                        padding: 0,
                        color: "#000",
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                      }}
                      onClick={() => dispatch(decreaseQuantityAndSync(item.id))}
                    >
                      <RemoveIcon />
                    </Button>
                    <Typography>{item.quantity}</Typography>
                    <Button
                      size="small"
                      sx={{
                        height: "32px",
                        minWidth: "32px",
                        padding: 0,
                        backgroundColor: "#6C5DD3",
                        color: "#fff",
                        borderRadius: "10px",
                      }}
                      onClick={() => dispatch(increaseQuantityAndSync(item.id))}
                    >
                      <AddIcon />
                    </Button>
                  </Box>
                </Box>
                <Divider sx={{ my: 1 }} />
              </Box>
            ))
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Cart is emppty
            </Typography>
          )}

          {cartItems.length > 0 && (
            <Button
              variant="contained"
              sx={{
                mt: "auto",
                borderRadius: "10px",
                fontWeight: 600,
                background:
                  "linear-gradient(90deg,rgba(108, 93, 211, 1) 0%, rgba(191, 166, 255, 1) 100%)",
              }}
              fullWidth
              onClick={() => {
                setIsCartOpen(false);
                navigate("/billing");
              }}
            >
              Checkout
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Home;
