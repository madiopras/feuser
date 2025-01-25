"use client";

import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import RouteList from "./routelist";
import { Button } from "@/components/ui/button";
import SearchRoute from "./search-route";
const BookingPage = () => {
  return (
    <div>
      <SearchRoute />
      <RouteList />
      <RouteList />
      <RouteList />
      <RouteList />
      <RouteList />
    </div>
  );
};

export default BookingPage;
