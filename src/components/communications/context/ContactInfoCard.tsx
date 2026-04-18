import React, { memo } from "react";
import {
  User2,
  Mail,
  Phone,
  Building2,
  BriefcaseBusiness,
  MapPin,
  Globe,
  BadgeCheck,
  CalendarDays,
  Sparkles,
  MessageSquare,
  PhoneCall,
  Pencil,
  Copy,
  Star,
  UserCircle2,
  Landmark,
  Tag,
  FileText,
} from "lucide-react";

export type ContactInfoCardData = {
  id?: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  whatsapp?: string;
  company?: string;
  designation?: string;
  industry?: string;
  source?: string;
  owner?: string;
  status?: string;
  priority?: "low" | "medium" | "high" | "vip";
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  notes?: string;
  tags?: string[];
  createdAt?: string;
  lastContactedAt?: string;
  avatarUrl?: string;
  isVerified?: boolean;
};

type Props = {
  contact?: ContactInfoCardData | null;
  loading?: boolean;
  className?: string;
  onCall?: (contact: ContactInfoCardData) => void;
  onMessage?: (contact: ContactInfoCardData) => void;
  onEmail?: (contact: ContactInfoCardData) => void;
  onEdit?: (contact: ContactInfoCardData) => void;
  onCopyPhone?: (phone: string, contact: ContactInfoCardData) => void;
  onCopyEmail?: (email: string, contact: ContactInfoCardData) => void;
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  borderRadius: 24,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const heroStyle: React.CSSProperties = {
  position: "relative",
  padding: 20,
  background:
    "linear-gradient(135deg, rgba(239,246,255,1) 0%, rgba(248,250,252,1) 55%, rgba(255,255,255,1) 100%)",
  borderBottom: "1px solid #e2e8f0",
};

const heroGlowStyle: React.CSSProperties = {
  position: "absolute",
  right: -40,
  top: -50,
  width: 180,
  height: 180,
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(59,130,246,0.14) 0%, rgba(59,130,246,0) 72%)",
  pointerEvents: "none",
};

const headerRowStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 14,
  flexWrap: "wrap",
};

const profileWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 14,
  minWidth: 0,
  flex: 1,
};

const avatarStyle: React.CSSProperties = {
  width: 68,
  height: 68,
  minWidth: 68,
  borderRadius: 20,
  border: "1px solid #dbeafe",
  background: "#eff6ff",
  color: "#1d4ed8",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 24,
  fontWeight: 800,
  overflow: "hidden",
  boxShadow: "0 10px 24px rgba(37, 99, 235, 0.12)",
};

const identityWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  minWidth: 0,
};

const nameRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const nameStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 22,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.03em",
  lineHeight: 1.2,
};

const metaLineStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const metaTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#475569",
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  borderRadius: 999,
  padding: "6px 10px",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.02em",
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  color: "#475569",
};

const actionRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const actionButtonStyle: React.CSSProperties = {
  appearance: "none",
  border: "1px solid #dbe3ef",
  background: "#ffffff",
  color: "#334155",
  borderRadius: 12,
  padding: "10px 12px",
  fontSize: 12,
  fontWeight: 800,
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  cursor: "pointer",
};

const primaryActionButtonStyle: React.CSSProperties = {
  ...actionButtonStyle,
  background: "#2563eb",
  color: "#ffffff",
  border: "1px solid #2563eb",
  boxShadow: "0 12px 24px rgba(37, 99, 235, 0.16)",
};

const contentStyle: React.CSSProperties = {
  padding: 20,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)",
  gap: 16,
  minWidth: 0,
};

const columnStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  minWidth: 0,
};

const sectionStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  borderRadius: 18,
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 14,
  minWidth: 0,
};

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.02em",
};

const infoGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
};

const infoItemStyle: React.CSSProperties = {
  borderRadius: 14,
  border: "1px solid #edf2f7",
  background: "#f8fafc",
  padding: "12px 14px",
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#64748b",
};

const valueStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "#0f172a",
  lineHeight: 1.5,
  wordBreak: "break-word",
};

const mutedValueStyle: React.CSSProperties = {
  ...valueStyle,
  color: "#94a3b8",
  fontWeight: 600,
};

const helperTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.7,
};

const tagWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const tagStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  borderRadius: 999,
  padding: "7px 10px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#334155",
  fontSize: 12,
  fontWeight: 700,
};

const notesStyle: React.CSSProperties = {
  borderRadius: 14,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  padding: 14,
  fontSize: 13,
  color: "#334155",
  lineHeight: 1.8,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const skeletonStyle: React.CSSProperties = {
  borderRadius: 12,
  background:
    "linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)",
  backgroundSize: "200% 100%",
  animation: "contactInfoCardPulse 1.4s ease-in-out infinite",
};

function ContactInfoCard({
  contact,
  loading = false,
  className,
  onCall,
  onMessage,
  onEmail,
  onEdit,
  onCopyPhone,
  onCopyEmail,
}: Props) {
  if (loading) {
    return (
      <div className={className} style={cardStyle}>
        <style>
          {`
            @keyframes contactInfoCardPulse {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }

            @media (max-width: 1080px) {
              .contact-info-card-content {
                grid-template-columns: 1fr !important;
              }
            }

            @media (max-width: 768px) {
              .contact-info-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}
        </style>

        <div style={heroStyle}>
          <div style={heroGlowStyle} />
          <div style={headerRowStyle}>
            <div style={profileWrapStyle}>
              <div style={{ ...skeletonStyle, width: 68, height: 68, borderRadius: 20 }} />
              <div style={{ ...identityWrapStyle, width: "100%" }}>
                <div style={{ ...skeletonStyle, height: 24, width: 180 }} />
                <div style={{ ...skeletonStyle, height: 14, width: 240 }} />
                <div style={{ ...skeletonStyle, height: 14, width: 160 }} />
              </div>
            </div>
          </div>
        </div>

        <div className="contact-info-card-content" style={contentStyle}>
          <div style={columnStyle}>
            <div className="contact-info-grid" style={infoGridStyle}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} style={infoItemStyle}>
                  <div style={{ ...skeletonStyle, height: 10, width: 80 }} />
                  <div style={{ ...skeletonStyle, height: 16, width: "70%" }} />
                </div>
              ))}
            </div>
          </div>

          <div style={columnStyle}>
            <div style={sectionStyle}>
              <div style={{ ...skeletonStyle, height: 18, width: 120 }} />
              <div style={{ ...skeletonStyle, height: 14, width: "100%" }} />
              <div style={{ ...skeletonStyle, height: 14, width: "85%" }} />
              <div style={{ ...skeletonStyle, height: 14, width: "60%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className={className} style={cardStyle}>
        <div style={heroStyle}>
          <div style={heroGlowStyle} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h3 style={nameStyle}>No contact selected</h3>
            <p style={helperTextStyle}>
              Choose a contact to view profile details, communication info, and ownership context.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const initials = getInitials(contact.fullName);
  const address = formatAddress(contact);

  return (
    <div className={className} style={cardStyle}>
      <style>
        {`
          @media (max-width: 1080px) {
            .contact-info-card-content {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 768px) {
            .contact-info-grid {
              grid-template-columns: 1fr !important;
            }

            .contact-info-header-row {
              flex-direction: column;
              align-items: stretch !important;
            }
          }
        `}
      </style>

      <div style={heroStyle}>
        <div style={heroGlowStyle} />

        <div className="contact-info-header-row" style={headerRowStyle}>
          <div style={profileWrapStyle}>
            <div style={avatarStyle}>
              {contact.avatarUrl ? (
                <img
                  src={contact.avatarUrl}
                  alt={contact.fullName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                initials
              )}
            </div>

            <div style={identityWrapStyle}>
              <div style={nameRowStyle}>
                <h3 style={nameStyle}>{contact.fullName}</h3>
                {contact.isVerified ? (
                  <span
                    style={{
                      ...badgeStyle,
                      background: "#ecfdf5",
                      border: "1px solid #a7f3d0",
                      color: "#047857",
                    }}
                  >
                    <BadgeCheck size={12} />
                    Verified
                  </span>
                ) : null}
              </div>

              <div style={metaLineStyle}>
                {contact.designation ? (
                  <span style={metaTextStyle}>
                    <BriefcaseBusiness size={13} />
                    {contact.designation}
                  </span>
                ) : null}

                {contact.company ? (
                  <span style={metaTextStyle}>
                    <Building2 size={13} />
                    {contact.company}
                  </span>
                ) : null}
              </div>

              <div style={tagWrapStyle}>
                {contact.status ? (
                  <span style={getStatusBadgeStyle(contact.status)}>{contact.status}</span>
                ) : null}

                {contact.priority ? (
                  <span style={getPriorityBadgeStyle(contact.priority)}>
                    <Star size={11} />
                    {contact.priority.toUpperCase()}
                  </span>
                ) : null}

                {contact.source ? (
                  <span style={badgeStyle}>
                    <Sparkles size={11} />
                    {contact.source}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div style={actionRowStyle}>
            {contact.phone ? (
              <button
                type="button"
                style={primaryActionButtonStyle}
                onClick={() => onCall?.(contact)}
              >
                <PhoneCall size={14} />
                Call
              </button>
            ) : null}

            <button
              type="button"
              style={actionButtonStyle}
              onClick={() => onMessage?.(contact)}
            >
              <MessageSquare size={14} />
              Message
            </button>

            {contact.email ? (
              <button
                type="button"
                style={actionButtonStyle}
                onClick={() => onEmail?.(contact)}
              >
                <Mail size={14} />
                Email
              </button>
            ) : null}

            <button
              type="button"
              style={actionButtonStyle}
              onClick={() => onEdit?.(contact)}
            >
              <Pencil size={14} />
              Edit
            </button>
          </div>
        </div>
      </div>

      <div className="contact-info-card-content" style={contentStyle}>
        <div style={columnStyle}>
          <div style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <UserCircle2 size={16} color="#2563eb" />
              <h4 style={sectionTitleStyle}>Primary Contact Information</h4>
            </div>

            <div className="contact-info-grid" style={infoGridStyle}>
              <InfoItem
                label="Email Address"
                value={contact.email}
                icon={<Mail size={14} />}
                actionLabel={contact.email ? "Copy" : undefined}
                onAction={
                  contact.email
                    ? () => onCopyEmail?.(contact.email as string, contact)
                    : undefined
                }
              />

              <InfoItem
                label="Phone Number"
                value={contact.phone}
                icon={<Phone size={14} />}
                actionLabel={contact.phone ? "Copy" : undefined}
                onAction={
                  contact.phone
                    ? () => onCopyPhone?.(contact.phone as string, contact)
                    : undefined
                }
              />

              <InfoItem
                label="Alternate Phone"
                value={contact.alternatePhone}
                icon={<Phone size={14} />}
              />

              <InfoItem
                label="WhatsApp"
                value={contact.whatsapp}
                icon={<MessageSquare size={14} />}
              />

              <InfoItem
                label="Website"
                value={contact.website}
                icon={<Globe size={14} />}
              />

              <InfoItem
                label="Industry"
                value={contact.industry}
                icon={<Landmark size={14} />}
              />
            </div>
          </div>

          <div style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <Building2 size={16} color="#2563eb" />
              <h4 style={sectionTitleStyle}>Business & Ownership Context</h4>
            </div>

            <div className="contact-info-grid" style={infoGridStyle}>
              <InfoItem
                label="Company"
                value={contact.company}
                icon={<Building2 size={14} />}
              />

              <InfoItem
                label="Designation"
                value={contact.designation}
                icon={<BriefcaseBusiness size={14} />}
              />

              <InfoItem
                label="Lead Source"
                value={contact.source}
                icon={<Sparkles size={14} />}
              />

              <InfoItem
                label="Relationship Owner"
                value={contact.owner}
                icon={<User2 size={14} />}
              />

              <InfoItem
                label="Created On"
                value={formatDate(contact.createdAt)}
                icon={<CalendarDays size={14} />}
              />

              <InfoItem
                label="Last Contacted"
                value={formatDate(contact.lastContactedAt)}
                icon={<CalendarDays size={14} />}
              />
            </div>
          </div>

          <div style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <MapPin size={16} color="#2563eb" />
              <h4 style={sectionTitleStyle}>Address</h4>
            </div>

            <div style={notesStyle}>
              {address || "No address information available yet."}
            </div>
          </div>
        </div>

        <div style={columnStyle}>
          <div style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <Tag size={16} color="#2563eb" />
              <h4 style={sectionTitleStyle}>Tags & Classification</h4>
            </div>

            {contact.tags && contact.tags.length > 0 ? (
              <div style={tagWrapStyle}>
                {contact.tags.map((tagItem) => (
                  <span key={tagItem} style={tagStyle}>
                    <Tag size={11} />
                    {tagItem}
                  </span>
                ))}
              </div>
            ) : (
              <div style={helperTextStyle}>
                No tags assigned yet. Add tags to improve segmentation and filtering.
              </div>
            )}
          </div>

          <div style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <FileText size={16} color="#2563eb" />
              <h4 style={sectionTitleStyle}>Notes</h4>
            </div>

            <div style={notesStyle}>
              {contact.notes?.trim()
                ? contact.notes
                : "No notes added yet. Use this space for context, preferences, objections, and follow-up memory."}
            </div>
          </div>

          <div
            style={{
              ...sectionStyle,
              background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
              border: "1px solid #dbeafe",
            }}
          >
            <div style={sectionHeaderStyle}>
              <Sparkles size={16} color="#2563eb" />
              <h4 style={sectionTitleStyle}>Relationship Snapshot</h4>
            </div>

            <div style={helperTextStyle}>
              This card brings together personal details, business identity, ownership,
              and contactability so the sales team can respond faster and with better context.
            </div>

            <div style={helperTextStyle}>
              Strong profiles usually include verified phone, a clear source, ownership,
              recent contact history, and notes that preserve conversation memory.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon,
  actionLabel,
  onAction,
}: {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div style={infoItemStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <span style={labelStyle}>{label}</span>

        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            style={{
              appearance: "none",
              border: "none",
              background: "transparent",
              color: "#2563eb",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 800,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: 0,
            }}
          >
            <Copy size={11} />
            {actionLabel}
          </button>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          minWidth: 0,
        }}
      >
        {icon ? (
          <span
            style={{
              marginTop: 2,
              color: "#64748b",
              display: "inline-flex",
              flexShrink: 0,
            }}
          >
            {icon}
          </span>
        ) : null}

        <span style={value ? valueStyle : mutedValueStyle}>
          {value?.trim() ? value : "Not available"}
        </span>
      </div>
    </div>
  );
}

function getInitials(name?: string) {
  if (!name?.trim()) return "NA";

  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join("");
}

function formatAddress(contact: ContactInfoCardData) {
  return [
    contact.addressLine1,
    contact.addressLine2,
    contact.city,
    contact.state,
    contact.country,
    contact.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
}

function formatDate(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

function getStatusBadgeStyle(status: string): React.CSSProperties {
  const normalized = status.trim().toLowerCase();

  if (["active", "qualified", "customer", "engaged"].includes(normalized)) {
    return {
      ...badgeStyle,
      background: "#ecfdf5",
      border: "1px solid #a7f3d0",
      color: "#047857",
    };
  }

  if (["inactive", "cold", "lost", "blocked"].includes(normalized)) {
    return {
      ...badgeStyle,
      background: "#fef2f2",
      border: "1px solid #fecaca",
      color: "#b91c1c",
    };
  }

  if (["new", "prospect", "follow-up", "pending"].includes(normalized)) {
    return {
      ...badgeStyle,
      background: "#fff7ed",
      border: "1px solid #fed7aa",
      color: "#c2410c",
    };
  }

  return badgeStyle;
}

function getPriorityBadgeStyle(
  priority: NonNullable<ContactInfoCardData["priority"]>
): React.CSSProperties {
  if (priority === "vip") {
    return {
      ...badgeStyle,
      background: "#faf5ff",
      border: "1px solid #e9d5ff",
      color: "#7c3aed",
    };
  }

  if (priority === "high") {
    return {
      ...badgeStyle,
      background: "#fef2f2",
      border: "1px solid #fecaca",
      color: "#b91c1c",
    };
  }

  if (priority === "medium") {
    return {
      ...badgeStyle,
      background: "#fff7ed",
      border: "1px solid #fed7aa",
      color: "#c2410c",
    };
  }

  return {
    ...badgeStyle,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#475569",
  };
}

export default memo(ContactInfoCard);