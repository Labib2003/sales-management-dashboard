import {
  type smd_ProductPrice,
  type smd_InvoiceItem,
  type smd_Product,
} from "@prisma/client";
import { EyeIcon } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const InvoiceDetailsModal = ({
  items,
}: {
  items: (smd_InvoiceItem & {
    product_price: smd_ProductPrice & { product: smd_Product };
  })[];
}) => {
  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({ variant: "outline", size: "icon" })}
      >
        <EyeIcon />
      </DialogTrigger>
      <DialogContent className="max-w-full md:max-w-fit">
        <DialogHeader>
          <DialogTitle>Invoice Items</DialogTitle>
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Package Price</TableHead>
              <TableHead>Package Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Unit Quantity</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.product_price.product.name}</TableCell>
                <TableCell>${item.product_price.package_price / 100}</TableCell>
                <TableCell>{item.package_quantity}</TableCell>
                <TableCell>
                  {item.product_price.unit_price
                    ? "$" + item.product_price.unit_price / 100
                    : "N/A"}
                </TableCell>
                <TableCell>{item.unit_quantity}</TableCell>
                <TableCell className="text-right">
                  $
                  {(item.package_quantity * item.product_price.package_price +
                    item.unit_quantity * (item.product_price.unit_price ?? 0)) /
                    100}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="font-bold">Grand Total: </TableCell>
              <TableCell className="text-right">
                $
                {items.reduce((acc, curr) => {
                  return (acc +=
                    (curr.package_quantity * curr.product_price.package_price +
                      curr.unit_quantity *
                      (curr.product_price.unit_price ?? 0)) /
                    100);
                }, 0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetailsModal;
