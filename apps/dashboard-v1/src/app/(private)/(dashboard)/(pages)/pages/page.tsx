import { Card, CardContent } from "@/components/card";
import { ComingSoonOverlay } from "@/components/coming-soon-overlay";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Pencil2Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function PagesPage() {
  return (
    <div className="dd-flex dd-h-full dd-w-full dd-flex-col dd-gap-4">
      <Card as="header">
        <CardContent
          title="Pages"
          titleLevel="h1"
          action={
            <ComingSoonOverlay as={Button} variant="outline" asChild>
              <Link href="/">
                Create New Page <PlusIcon className="dd-ml-2 dd-h-4 dd-w-4" />
              </Link>
            </ComingSoonOverlay>
          }
        />
      </Card>
      <main className="dd-flex dd-flex-1 dd-gap-4 dd-overflow-y-hidden">
        <Card className="dd-h-full dd-flex-[3]">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="dd-w-[200px]">Page</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Last Edited</TableHead>
                  <TableHead>Create Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="dd-overflow-y-scroll">
                <TableRow>
                  <TableCell>Beranda</TableCell>
                  <TableCell>
                    <Switch />
                  </TableCell>
                  <TableCell>2023-06-23 14:00:00 AM</TableCell>
                  <TableCell>2023-06-23</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Beranda</TableCell>
                  <TableCell>
                    <Switch />
                  </TableCell>
                  <TableCell>2023-06-23 14:00:00 AM</TableCell>
                  <TableCell>2023-06-23</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Beranda</TableCell>
                  <TableCell>
                    <Switch />
                  </TableCell>
                  <TableCell>2023-06-23 14:00:00 AM</TableCell>
                  <TableCell>2023-06-23</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Beranda</TableCell>
                  <TableCell>
                    <Switch />
                  </TableCell>
                  <TableCell>2023-06-23 14:00:00 AM</TableCell>
                  <TableCell>2023-06-23</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Beranda</TableCell>
                  <TableCell>
                    <Switch />
                  </TableCell>
                  <TableCell>2023-06-23 14:00:00 AM</TableCell>
                  <TableCell>2023-06-23</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Beranda</TableCell>
                  <TableCell>
                    <Switch />
                  </TableCell>
                  <TableCell>2023-06-23 14:00:00 AM</TableCell>
                  <TableCell>2023-06-23</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Beranda</TableCell>
                  <TableCell>
                    <Switch />
                  </TableCell>
                  <TableCell>2023-06-23 14:00:00 AM</TableCell>
                  <TableCell>2023-06-23</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Beranda</TableCell>
                  <TableCell>
                    <Switch />
                  </TableCell>
                  <TableCell>2023-06-23 14:00:00 AM</TableCell>
                  <TableCell>2023-06-23</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Beranda</TableCell>
                  <TableCell>
                    <Switch />
                  </TableCell>
                  <TableCell>2023-06-23 14:00:00 AM</TableCell>
                  <TableCell>2023-06-23</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Beranda</TableCell>
                  <TableCell>
                    <Switch />
                  </TableCell>
                  <TableCell>2023-06-23 14:00:00 AM</TableCell>
                  <TableCell>2023-06-23</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Beranda</TableCell>
                  <TableCell>
                    <Switch />
                  </TableCell>
                  <TableCell>2023-06-23 14:00:00 AM</TableCell>
                  <TableCell>2023-06-23</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="dd-flex dd-h-full dd-flex-[2] dd-flex-col">
          <CardContent
            className="dd-flex-1 dd-bg-slate-50"
            title="Beranda"
            titleLevel="h2"
            description="https://www.hooore.com/beranda"
            action={
              <div className="dd-flex dd-gap-2">
                <Button type="button" variant="outline" size="icon">
                  <TrashIcon className="dd-h-4 dd-w-4" />
                </Button>
                <Button type="button" variant="outline" size="icon" asChild>
                  <Link href="/page/foo">
                    <Pencil2Icon className="dd-h-4 dd-w-4" />
                  </Link>
                </Button>
              </div>
            }
          />
          <CardContent>
            <div className="dd-h-full dd-w-full dd-bg-black"></div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}