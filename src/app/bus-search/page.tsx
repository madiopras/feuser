import BusSearchFormWrapper from "@/components/BusSearchFormWrapper";

export default function BusSearchPage() {
  return (
    <div className="container">
      <div className="py-16">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8">
          Cari Tiket Bus
        </h2>
        <BusSearchFormWrapper />
      </div>
    </div>
  );
}
