import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import discount from "../../assets/Discount.png";
import TextField from "@mui/material/TextField";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchBillingDetails } from "../../redux/slices/billingSlice";
import { removeFromCartAndSync } from "../../redux/slices/homeSlice";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const productFields = (p) => [
  { label: "Quantity", value: p.quantity },
  { label: "Unit Price", value: `₹${p.price}` },
  { label: "Total", value: `₹${p.total}` },
];

const Billing = () => {
  const formatAmount = (amount) => {
    if (!amount) return "0.00";
    const cleanedAmount = String(amount).replace(/[^0-9.]/g, "");
    const num = parseFloat(cleanedAmount);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const handleGenerateInvoice = () => {
    if (!billingDetails || billingDetails.length === 0) {
      console.error("Billing details are missing.");
      return;
    }

    const doc = new jsPDF({ unit: "pt", format: "a4" });

    doc.setFontSize(18);
    doc.setTextColor(108, 93, 211);
    doc.text("Invoice", 297.5, 40, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Booking Summary - APT-001", 40, 70);

    const tableColumn = ["Product", "Quantity", "Unit Price", "Total"];
    const tableRows = billingDetails.map((p) => [
      p.name,
      p.quantity,
      `Rs. ${formatAmount(p.price)}`,
      `Rs. ${formatAmount(p.total)}`,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 85,
      theme: "grid",
      headStyles: { fillColor: [108, 93, 211], textColor: 255 },
      columnStyles: {
        2: { halign: "right", columnWidth: 80 },
        3: { halign: "right", columnWidth: 80 },
      },
      styles: { fontSize: 10, cellPadding: 5 },
    });

    const finalY = doc.lastAutoTable.finalY;

    const summaryItems = [
      ["Service Total", `Rs. ${formatAmount(serviceTotal)}`],
      ["Product Total", `Rs. ${formatAmount(productTotal)}`],
      ["Order Discount (%)", `${discountInPercent}`],
      [`Tax (${taxInPercent}%)`, `Rs. ${formatAmount(taxAmount)}`],
      [
        "Final Total (after discount)",
        `Rs. ${formatAmount(finalTotalAfterDiscount)}`,
      ],
      [
        { content: "Grand Total", styles: { fontStyle: "bold" } },
        {
          content: `Rs. ${formatAmount(grandTotal)}`,
          styles: { fontStyle: "bold" },
        },
      ],
    ];

    autoTable(doc, {
      body: summaryItems,
      startY: finalY + 20,
      theme: "plain", // No borders for a clean look
      showHead: false, // No header row
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "right" }, // Perfect right alignment for amounts
      },
      styles: { fontSize: 11 },
      margin: { left: 40 }, // Align with the start of the product table
    }); // --- Save the PDF ---

    doc.save("Invoice_APT-001.pdf");
  };

  const navigate = useNavigate();
  const {
    billingDetails = [],
    status = "idle",
    error = null,
    serviceTotal = 0,
    productTotal = 0,
    finalTotalAfterDiscount = 0,
    taxAmount = 0,
    grandTotal = 0,
    discountInPercent = 0,
    taxInPercent = 18,
  } = useSelector((state) => state.billing || {});
  const dispatch = useDispatch();
  const { lastCartResponse } = useSelector((state) => state.home || {});

  useEffect(() => {
    if (status === "idle") dispatch(fetchBillingDetails());
  }, [status, dispatch]);

  useEffect(() => {
    if (lastCartResponse) {
      dispatch(fetchBillingDetails());
    }
  }, [lastCartResponse, dispatch]);

  const handleDelete = async (product) => {
    const productId = product._id || product.id;
    if (!productId) return;
    try {
      await dispatch(removeFromCartAndSync(productId)).unwrap();
      dispatch(fetchBillingDetails());
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const orderDiscountPercent = discountInPercent;
  const displayedTax = taxAmount;
  const displayedFinalTotal = finalTotalAfterDiscount;
  const displayedGrandTotal = grandTotal;

  return (
    <Grid sx={{ p: 4 }}>
      <Grid
        size={12}
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            Appointment Completion
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Booking Summary - APT-001
          </Typography>
        </Box>
        <Box>
          <Button
            size="small"
            sx={{
              background: "#6C5DD3",
              background:
                "linear-gradient(90deg,rgba(108, 93, 211, 1) 0%, rgba(191, 166, 255, 1) 100%)",
              color: "white",
              borderRadius: 2,
              textTransform: "none",
              height: 30,
              m: 1,
            }}
            onClick={() => navigate("/home")}
          >
            Back
          </Button>
        </Box>
      </Grid>

      <Grid container size={12} spacing={2} mt={1}>
        {/* Products Used */}
        <Grid size={{ xs: 12, md: billingDetails.length > 0 ? 8 : 12 }}>
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 2,
              bgcolor: "white",
              boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
              <ViewInArIcon />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Products Used
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {status === "loading" && (
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              )}
              {status === "failed" && (
                <Typography variant="body2" color="error">
                  Failed to load billing items: {error}
                </Typography>
              )}
              {(billingDetails || []).length === 0 &&
                status === "succeeded" && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    No billing items found
                  </Typography>
                )}

              {(billingDetails || []).map((p) => (
                <Grid
                  key={p._id || p.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  variant="outlined"
                >
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      {p.name}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 4, mt: 1 }}>
                      {productFields(p).map((field) => (
                        <Box key={field.label}>
                          <Typography variant="caption" color="text.secondary">
                            {field.label}
                          </Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            {field.value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: { xs: "center", sm: "flex-end" },
                      gap: 1,
                      mt: { xs: 2, sm: 0 },
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton size="small">
                        <EditOutlinedIcon
                          fontSize="small"
                          sx={{ color: "#000" }}
                        />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(p)}>
                        <DeleteOutlineIcon
                          fontSize="small"
                          sx={{ color: "#000" }}
                        />
                      </IconButton>
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                        borderColor: "#ccc",
                        color: "#000",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <Box
                        component={"img"}
                        src={discount}
                        alt="discount"
                        sx={{ height: "15px", width: "15px" }}
                      />
                      Special Discount
                    </Button>
                  </Box>
                </Grid>
              ))}

              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "center",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                }}
              >
                <Button
                  startIcon={<AddIcon />}
                  sx={{ textTransform: "none", color: "#000" }}
                  onClick={() => navigate("/home")}
                >
                  {billingDetails.length === 0
                    ? "Add Products"
                    : "Add Extra Products"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Billing Summary */}
        {billingDetails.length > 0 && (
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "white",
                boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Billing Summary
              </Typography>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" sx={{ color: "#000" }}>
                  Service Total
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  ₹{serviceTotal}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" sx={{ color: "#000" }}>
                  Product Total
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  ₹{productTotal}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="body2" sx={{ color: "#000" }}>
                  Order Discount (%)
                </Typography>
                <Box>
                  <Box
                    sx={{
                      width: 50,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      px: 0.5,
                      border: "1px solid #ccc",
                      borderRadius: 1,
                      fontSize: "15px",
                      fontWeight: 500,
                      backgroundColor: "transparent",
                    }}
                  >
                    {`${orderDiscountPercent}`}
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="body2" sx={{ color: "#000" }}>
                  Tax ({taxInPercent}%)
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  ₹{(displayedTax || 0).toFixed(2)}
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" sx={{ color: "#000" }}>
                  Final Total (after discount)
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  ₹{(displayedFinalTotal || 0).toFixed(2)}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Grand Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  ₹{(displayedGrandTotal || 0).toFixed(2)}
                </Typography>
              </Box>

              <Button
                fullWidth
                sx={{
                  background: "#6C5DD3",
                  background:
                    "linear-gradient(90deg,rgba(108, 93, 211, 1) 0%, rgba(191, 166, 255, 1) 100%)",
                  color: "white",
                  borderRadius: 2,
                  textTransform: "none",
                  py: 1.5,
                  gap: 1,
                }}
                onClick={handleGenerateInvoice}
              >
                <AutoAwesomeIcon sx={{ fontSize: "small" }} />
                Complete Payment
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default Billing;
