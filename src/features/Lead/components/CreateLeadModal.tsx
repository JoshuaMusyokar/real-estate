import {
  Loader2,
  Plus,
  X,
  MapPin,
  Search,
  Building2,
  User,
  Home,
  TrendingUp,
  Tag,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  useGetPropertyTypesQuery,
  useGetUserPropertiesQuery,
} from "../../../services/propertyApi";
import {
  useGetCitiesQuery,
  useGetLocalitiesQuery,
} from "../../../services/locationApi";
import { useGetAgentsForAssignmentQuery } from "../../../services/agentApi";
import { LEAD_SOURCES, LEAD_STAGES, LEAD_PRIORITIES } from "../../../utils";
import type {
  LeadCreateRequest,
  LeadSource,
  LeadStage,
  LeadPriority,
  PropertyPurpose,
} from "../../../types";
import { useCreateLeadMutation } from "../../../services/leadApi";
import { usePermissions } from "../../../hooks/usePermissions";

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ── Shared styles ──────────────────────────────────────────────────────────────
const inp =
  "w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white";
const lbl =
  "block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1";

// ── Section wrapper ────────────────────────────────────────────────────────────
const Section: React.FC<{
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}> = ({ icon: Icon, title, children }) => (
  <div>
    <div className="flex items-center gap-1.5 mb-2.5">
      <Icon className="w-3.5 h-3.5 text-blue-500" />
      <h3 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
export const CreateLeadModal: React.FC<CreateLeadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [createLead, { isLoading }] = useCreateLeadMutation();
  const { can } = usePermissions();
  const canAssign = can("lead.assign");

  const [form, setForm] = useState<
    LeadCreateRequest & {
      stage?: LeadStage;
      priority?: LeadPriority;
      assignedToId?: string;
    }
  >({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    source: "MANUAL_ENTRY",
    cityId: "",
    localities: [],
    propertyTypeId: "",
    purpose: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: "",
    requirements: "",
    tags: [],
    interestedProperties: [],
    stage: "NEW_LEAD",
    priority: "MEDIUM",
  });

  const [tagInput, setTagInput] = useState("");
  const [propSearch, setPropSearch] = useState("");
  const [agentSearch, setAgentSearch] = useState("");
  const [localitySearch, setLocalitySearch] = useState("");

  // ── Queries ──────────────────────────────────────────────────────────────────
  const { data: propertyTypesData } = useGetPropertyTypesQuery(
    { isActive: true },
    { skip: !isOpen },
  );
  const { data: citiesData } = useGetCitiesQuery(
    { limit: 200 },
    { skip: !isOpen },
  );
  const { data: localitiesData } = useGetLocalitiesQuery(
    { cityId: form.cityId || "", limit: 500 },
    { skip: !isOpen || !form.cityId },
  );
  const { data: propertiesData, isLoading: loadingProps } =
    useGetUserPropertiesQuery(
      { search: propSearch || undefined, limit: 30 },
      { skip: !isOpen },
    );
  const { data: agentsData } = useGetAgentsForAssignmentQuery(
    { search: agentSearch || undefined },
    { skip: !isOpen || !canAssign },
  );

  const propertyTypes = propertyTypesData?.data || [];
  const cities = citiesData?.data || [];
  const localities = localitiesData?.data || [];
  const properties = propertiesData?.data || [];
  const agents = agentsData?.data || [];

  const reset = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      alternatePhone: "",
      source: "MANUAL_ENTRY",
      cityId: "",
      localities: [],
      propertyTypeId: "",
      purpose: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: "",
      requirements: "",
      tags: [],
      interestedProperties: [],
      stage: "NEW_LEAD",
      priority: "MEDIUM",
    });
    setTagInput("");
    setPropSearch("");
    setAgentSearch("");
    setLocalitySearch("");
  };

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.phone || !form.cityId) return;
    try {
      await createLead(form as LeadCreateRequest).unwrap();
      onSuccess();
      onClose();
      reset();
    } catch {
      //
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags?.includes(t)) {
      setForm((f) => ({ ...f, tags: [...(f.tags || []), t] }));
      setTagInput("");
    }
  };

  const toggleProp = (id: string) =>
    setForm((f) => ({
      ...f,
      interestedProperties: f.interestedProperties?.includes(id)
        ? f.interestedProperties.filter((p) => p !== id)
        : [...(f.interestedProperties || []), id],
    }));

  const toggleLocality = (name: string) =>
    setForm((f) => ({
      ...f,
      localities: f.localities?.includes(name)
        ? f.localities.filter((l) => l !== name)
        : [...(f.localities || []), name],
    }));

  const filteredLocalities = localities.filter((l) =>
    l.name.toLowerCase().includes(localitySearch.toLowerCase()),
  );

  if (!isOpen) return null;

  const isValid =
    !!form.firstName && !!form.email && !!form.phone && !!form.cityId;

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl max-h-[95vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
              Create New Lead
            </h2>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Fill required fields (*) and any relevant details
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-5">
          {/* ── Contact ──────────────────────────────────────────────────── */}
          <Section icon={User} title="Contact Information">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={lbl}>First Name *</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  placeholder="John"
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Last Name</label>
                <input
                  type="text"
                  value={form.lastName || ""}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  placeholder="Doe"
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Phone *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 7XX XXX XXX"
                  className={inp}
                />
              </div>
              <div className="col-span-2">
                <label className={lbl}>Alternate Phone</label>
                <input
                  type="tel"
                  value={form.alternatePhone || ""}
                  onChange={(e) =>
                    setForm({ ...form, alternatePhone: e.target.value })
                  }
                  placeholder="Optional"
                  className={inp}
                />
              </div>
            </div>
          </Section>

          {/* ── Location ─────────────────────────────────────────────────── */}
          <Section icon={MapPin} title="Location Preference">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className={lbl}>City *</label>
                <select
                  value={form.cityId || ""}
                  onChange={(e) =>
                    setForm({ ...form, cityId: e.target.value, localities: [] })
                  }
                  className={`${inp} appearance-none`}
                >
                  <option value="">Select city</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.state ? `, ${c.state}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Source</label>
                <select
                  value={form.source}
                  onChange={(e) =>
                    setForm({ ...form, source: e.target.value as LeadSource })
                  }
                  className={`${inp} appearance-none`}
                >
                  {LEAD_SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Localities — show only when city selected */}
            {form.cityId && (
              <div>
                <label className={lbl}>
                  Localities
                  {(form.localities?.length ?? 0) > 0 && (
                    <span className="ml-1 text-blue-500 normal-case">
                      ({form.localities?.length} selected)
                    </span>
                  )}
                </label>
                <div className="relative mb-1.5">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    type="text"
                    value={localitySearch}
                    onChange={(e) => setLocalitySearch(e.target.value)}
                    placeholder="Filter localities…"
                    className={`${inp} pl-7`}
                  />
                </div>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
                  {filteredLocalities.slice(0, 40).map((l) => {
                    const selected = form.localities?.includes(l.name);
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => toggleLocality(l.name)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all
                          ${selected ? "bg-blue-600 border-blue-600 text-white" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300"}`}
                      >
                        {l.name}
                      </button>
                    );
                  })}
                  {filteredLocalities.length === 0 && (
                    <p className="text-[10px] text-gray-400 p-1">
                      No localities found
                    </p>
                  )}
                </div>
              </div>
            )}
          </Section>

          {/* ── Property Requirements ─────────────────────────────────────── */}
          <Section icon={Home} title="Property Requirements">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className={lbl}>Property Type</label>
                <select
                  value={form.propertyTypeId || ""}
                  onChange={(e) =>
                    setForm({ ...form, propertyTypeId: e.target.value })
                  }
                  className={`${inp} appearance-none`}
                >
                  <option value="">Any type</option>
                  {propertyTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Purpose</label>
                <select
                  value={form.purpose || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      purpose: (e.target.value as PropertyPurpose) || undefined,
                    })
                  }
                  className={`${inp} appearance-none`}
                >
                  <option value="">Any</option>
                  <option value="SALE">Sale</option>
                  <option value="RENT">Rent</option>
                  <option value="LEASE">Lease</option>
                  <option value="PG">PG</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Min Budget</label>
                <input
                  type="number"
                  value={form.minPrice ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      minPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="0"
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Max Budget</label>
                <input
                  type="number"
                  value={form.maxPrice ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      maxPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="No limit"
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Bedrooms</label>
                <input
                  type="text"
                  value={form.bedrooms || ""}
                  onChange={(e) =>
                    setForm({ ...form, bedrooms: e.target.value })
                  }
                  placeholder="e.g. 2, 3"
                  className={inp}
                />
              </div>
            </div>
            <div>
              <label className={lbl}>Requirements / Notes</label>
              <textarea
                rows={2}
                value={form.requirements || ""}
                onChange={(e) =>
                  setForm({ ...form, requirements: e.target.value })
                }
                placeholder="Any specific requirements…"
                className={`${inp} resize-none`}
              />
            </div>
          </Section>

          {/* ── Interested Properties ─────────────────────────────────────── */}
          <Section icon={Building2} title="Interested Properties">
            <div className="relative mb-1.5">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input
                type="text"
                value={propSearch}
                onChange={(e) => setPropSearch(e.target.value)}
                placeholder="Search your properties…"
                className={`${inp} pl-7`}
              />
            </div>
            {loadingProps ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              </div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {properties.length === 0 && (
                  <p className="text-[10px] text-gray-400 text-center py-3">
                    No properties found
                  </p>
                )}
                {properties.map((p) => {
                  const selected = form.interestedProperties?.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleProp(p.id)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer transition-all
                        ${selected ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0
                        ${selected ? "bg-blue-600" : "bg-gray-100 dark:bg-gray-700"}`}
                      >
                        {selected ? (
                          <Check className="w-3 h-3 text-white" />
                        ) : (
                          <Building2 className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-gray-900 dark:text-white truncate">
                          {p.title}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">
                          {p.locality} ·{" "}
                          {typeof p.city === "object" ? p.city.name : p.city}
                          <span className="ml-1 text-emerald-600 font-semibold">
                            · ₹{Number(p.price).toLocaleString("en-IN")}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {(form.interestedProperties?.length ?? 0) > 0 && (
              <p className="text-[10px] text-blue-600 font-semibold mt-1">
                {form.interestedProperties?.length} propert
                {form.interestedProperties?.length === 1 ? "y" : "ies"} selected
              </p>
            )}
          </Section>

          {/* ── Lead Status ──────────────────────────────────────────────── */}
          <Section icon={TrendingUp} title="Lead Status">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={lbl}>Stage</label>
                <select
                  value={form.stage || "NEW_LEAD"}
                  onChange={(e) =>
                    setForm({ ...form, stage: e.target.value as LeadStage })
                  }
                  className={`${inp} appearance-none`}
                >
                  {LEAD_STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Priority</label>
                <select
                  value={form.priority || "MEDIUM"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value as LeadPriority,
                    })
                  }
                  className={`${inp} appearance-none`}
                >
                  {LEAD_PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Section>

          {/* ── Assign Agent ─────────────────────────────────────────────── */}
          {canAssign && (
            <Section icon={User} title="Assign Agent (Optional)">
              <div className="relative mb-1.5">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input
                  type="text"
                  value={agentSearch}
                  onChange={(e) => setAgentSearch(e.target.value)}
                  placeholder="Search agents…"
                  className={`${inp} pl-7`}
                />
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {/* Unassign option */}
                <div
                  onClick={() => setForm({ ...form, assignedToId: undefined })}
                  className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all
                    ${!form.assignedToId ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}
                >
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0
                    ${!form.assignedToId ? "bg-blue-600" : "bg-gray-100 dark:bg-gray-700"}`}
                  >
                    {!form.assignedToId ? (
                      <Check className="w-3 h-3 text-white" />
                    ) : (
                      <User className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                    Unassigned
                  </span>
                </div>
                {agents.map((agent) => {
                  const selected = form.assignedToId === agent.id;
                  return (
                    <div
                      key={agent.id}
                      onClick={() =>
                        setForm({ ...form, assignedToId: agent.id })
                      }
                      className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer transition-all
                        ${selected ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-white text-[10px] font-black flex-shrink-0
                        ${selected ? "bg-blue-600" : "bg-gray-400 dark:bg-gray-600"}`}
                      >
                        {agent.firstName[0]}
                        {agent.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-gray-900 dark:text-white truncate">
                          {agent.firstName} {agent.lastName}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">
                          {agent.email}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border
                        ${{ low: "bg-green-100 text-green-700 border-green-200", medium: "bg-amber-100 text-amber-700 border-amber-200", high: "bg-red-100 text-red-700 border-red-200" }[agent.currentWorkload] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
                      >
                        {agent.currentWorkload}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* ── Tags ─────────────────────────────────────────────────────── */}
          <Section icon={Tag} title="Tags (Optional)">
            <div className="flex gap-1.5 mb-1.5">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Type a tag and press Enter"
                className={`${inp} flex-1`}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl transition-colors flex-shrink-0"
              >
                Add
              </button>
            </div>
            {(form.tags?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-1">
                {form.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-[10px] font-semibold"
                  >
                    {tag}
                    <button
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          tags: f.tags?.filter((t) => t !== tag),
                        }))
                      }
                      className="hover:text-blue-900 dark:hover:text-blue-200"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Section>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-4 py-3.5 sm:px-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 sm:py-2.5 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !isValid}
            className="flex-1 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating…
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Create Lead
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
