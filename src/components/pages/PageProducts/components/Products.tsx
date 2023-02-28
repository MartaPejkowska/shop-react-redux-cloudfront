import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { formatAsPrice } from "~/utils/utils";
import AddProductToCart from "~/components/AddProductToCart/AddProductToCart";
import axios from "axios";
import API_PATHS from "~/constants/apiPaths";
import { useState, useEffect } from "react";
import { Product } from "~/models/Product";
import { Box } from "@mui/system";
export default function Products() {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios.get(`${API_PATHS.bff}/products`)
      .then(res => setProducts(res.data)); 
      },[]);

  return (
    <Grid container spacing={4}>
      {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
      {products.map(({ count, ...product }, index) => (
        <Grid item key={product.id} xs={12} sm={6} md={4}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardMedia
              sx={{ pt: "56.25%" }}
              image={product.image}
              title={product.title}
            />
            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent:"space-between"}}>
              <Typography gutterBottom variant="h5" component="h2">
                {product.title} {product.packSize}
              </Typography>
              <Typography variant="subtitle2">{product.description}</Typography>
              <Box sx={{display:"flex", justifyContent: "space-between", alignItems:"center", mb:"0"}}>

              <Typography sx={{ pt: "10px" }}>{formatAsPrice(product.price)}</Typography>
            <CardActions disableSpacing={true}>
              <AddProductToCart product={product} />
            </CardActions>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
