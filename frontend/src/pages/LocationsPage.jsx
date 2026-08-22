import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";
import { toast } from "react-toastify";
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineClock,
  HiOutlineSearch,
  HiOutlineSparkles,
  HiOutlineBadgeCheck,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineX,
} from "react-icons/hi";
import { FiMapPin, FiNavigation, FiArrowRight, FiCheck } from "react-icons/fi";

const initialStores = [
  {
    id: 1,
    name: "San Francisco Flagship & Innovation Hub",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    region: "North America",
    address: "550 Market Street, Suite 1200, San Francisco, CA 94104",
    phone: "+1 (415) 890-4321",
    hours: "Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM",
    status: "Open Now",
    features: ["Instant 1-Hour Pickup", "Seller Onboarding Lounge", "Tech Repair Bar", "VIP Shopping Suites"],
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "New York SoHo Experience Store",
    city: "New York",
    state: "NY",
    country: "USA",
    region: "North America",
    address: "482 Broadway, Soho, New York, NY 10013",
    phone: "+1 (212) 674-9020",
    hours: "Mon - Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 7:00 PM",
    status: "Open Now",
    features: ["Instant 1-Hour Pickup", "Artisan Creator Gallery", "Express Returns Station"],
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "London Oxford Street Hub",
    city: "London",
    state: "England",
    country: "UK",
    region: "Europe",
    address: "215 Oxford St, Marylebone, London W1D 2LG",
    phone: "+44 20 7946 0912",
    hours: "Mon - Sat: 9:30 AM - 8:00 PM | Sun: 12:00 PM - 6:00 PM",
    status: "Open Now",
    features: ["Instant 1-Hour Pickup", "Seller Support Desk", "Cross-Border Logistics Center"],
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Tokyo Shibuya Crossing Showcase",
    city: "Tokyo",
    state: "Tokyo",
    country: "Japan",
    region: "Asia Pacific",
    address: "1-22-8 Jinnan, Shibuya-ku, Tokyo 150-0041",
    phone: "+81 3 5555 0143",
    hours: "Mon - Sun: 10:00 AM - 9:30 PM",
    status: "Open Now",
    features: ["AI Interactive Kiosks", "Instant Pickup", "Gadget Repair & Testing Bar"],
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Dubai Mall Flagship Pavilion",
    city: "Dubai",
    state: "Dubai",
    country: "UAE",
    region: "Middle East",
    address: "Financial Center Rd, Downtown Dubai",
    phone: "+971 4 388 7654",
    hours: "Mon - Sun: 10:00 AM - 11:00 PM",
    status: "Open Now",
    features: ["VIP Concierge Service", "Luxury Brand Showcase", "Express Curbside Delivery"],
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Sydney Martin Place Hub",
    city: "Sydney",
    state: "NSW",
    country: "Australia",
    region: "Asia Pacific",
    address: "120 Pitt St, Sydney NSW 2000",
    phone: "+61 2 9234 5678",
    hours: "Mon - Sat: 9:00 AM - 7:00 PM | Sun: 10:00 AM - 5:00 PM",
    status: "Open Now",
    features: ["Express Pickup & Dropoff", "Seller Training Workshop", "Eco-Packaging Desk"],
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80",
  },
];

const LocationsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedStore, setSelectedStore] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    service: "In-Store Order Pickup",
    date: "",
    time: "10:00 AM",
  });

  const regions = ["All", "North America", "Europe", "Asia Pacific", "Middle East"];

  const filteredStores = initialStores.filter((store) => {
    const matchesRegion = selectedRegion === "All" || store.region === selectedRegion;
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.date) {
      toast.error("Please fill in all required appointment fields.");
      return;
    }

    toast.success(
      `Appointment booked at ${selectedStore.name} for ${bookingForm.date} at ${bookingForm.time}! Confirmation sent to ${bookingForm.email}.`
    );
    setSelectedStore(null);
    setBookingForm({
      name: "",
      email: "",
      service: "In-Store Order Pickup",
      date: "",
      time: "10:00 AM",
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <Header activeHeading={0} />

      {/* HERO SECTION */}
      <section className="bg-slate-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-slate-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className={`${styles.section} relative z-10 text-center max-w-4xl mx-auto`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
            <HiOutlineLocationMarker className="w-4 h-4 text-indigo-400" />
            <span>Global Experience Centers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Visit a Nexus Store & <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Partner Hub</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Experience 1-hour in-store order pickups, seller onboarding desks, product testing bars, and live customer support in premier cities worldwide.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto relative flex items-center shadow-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, country or zip code (e.g. San Francisco, London)..."
              className="w-full pl-12 pr-4 py-4 bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-sm sm:text-base rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all"
            />
            <HiOutlineSearch className="absolute left-4 text-slate-400 w-5 h-5" />
          </div>
        </div>
      </section>

      {/* REGION FILTER & LIST */}
      <section className={`${styles.section} py-12 sm:py-16`}>
        {/* Region Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedRegion === region
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {region} {region === "All" ? `(${initialStores.length})` : ""}
            </button>
          ))}
        </div>

        {/* Store Grid */}
        {filteredStores.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
            <HiOutlineLocationMarker className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No stores found</h3>
            <p className="text-xs text-slate-500 mt-1">Try searching for another city or selecting "All" regions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                      {store.status}
                    </div>
                    <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-slate-200 text-[11px] font-semibold px-3 py-1 rounded-full border border-slate-700">
                      {store.country}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors mb-3">
                      {store.name}
                    </h3>

                    <div className="space-y-2.5 text-xs text-slate-600 mb-6">
                      <div className="flex items-start gap-2.5">
                        <HiOutlineLocationMarker className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{store.address}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <HiOutlinePhone className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>{store.phone}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <HiOutlineClock className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>{store.hours}</span>
                      </div>
                    </div>

                    {/* Store Feature Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
                      {store.features.map((feat, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-medium"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => setSelectedStore(store)}
                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <HiOutlineCalendar className="w-4 h-4" />
                    <span>Book In-Store Visit / Pickup</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* APPOINTMENT MODAL */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedStore(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-800 bg-slate-100 rounded-full transition-colors"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Book Appointment</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">{selectedStore.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{selectedStore.address}</p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                  placeholder="jane@example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Service Requested</label>
                <select
                  value={bookingForm.service}
                  onChange={(e) => setBookingForm({ ...bookingForm, service: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="In-Store Order Pickup">In-Store Order Pickup (1-Hour)</option>
                  <option value="Seller Onboarding Consultation">Seller Onboarding Consultation</option>
                  <option value="Tech Repair & Diagnostics Bar">Tech Repair & Diagnostics Bar</option>
                  <option value="VIP Shopping Consultation">VIP Shopping Consultation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Time Slot</label>
                  <select
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="12:30 PM">12:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  Confirm Appointment Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default LocationsPage;
