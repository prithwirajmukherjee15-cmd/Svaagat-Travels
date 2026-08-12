{
  "brand": {
    "name": "Thomas Cook India (pixel-faithful clone)",
    "attributes": [
      "trustworthy",
      "corporate-yet-friendly",
      "travel-aspirational",
      "conversion-focused",
      "information-dense but breathable"
    ],
    "visual_style": {
      "primary_style": "Clean corporate travel UI with rounded cards, strong navy header, warm yellow CTAs, white content surfaces.",
      "layout_principles": [
        "F-pattern scanning for dense listings",
        "Z-pattern for homepage hero + offers",
        "Bento-like card rows for offers/specials",
        "Sticky header + sticky filter sidebar on listings"
      ],
      "do_not": [
        "Do not introduce trendy neon gradients or purple/pink gradients.",
        "Do not center-align entire pages.",
        "Do not use overly playful illustration styles; keep photographic travel imagery.",
        "Do not change IA: keep Holidays/Flights/Forex as primary top-level tasks."
      ]
    }
  },

  "design_tokens": {
    "colors": {
      "note": "Base on Thomas Cook brand: deep blue + warm yellow. Keep content areas white; use blue for header/nav and yellow for CTAs/highlights.",
      "hex": {
        "tc-blue-900": "#062B5B",
        "tc-blue-800": "#033E7E",
        "tc-blue-700": "#0354A6",
        "tc-blue-600": "#0B66C3",
        "tc-blue-100": "#E8F1FF",

        "tc-yellow-500": "#FEC20F",
        "tc-yellow-400": "#FFD24D",
        "tc-yellow-100": "#FFF6D6",

        "ink-900": "#0B1220",
        "ink-700": "#2A3446",
        "ink-500": "#5B667A",

        "surface": "#FFFFFF",
        "surface-2": "#F6F8FC",
        "border": "#E3E8F2",

        "success": "#0E9F6E",
        "warning": "#F59E0B",
        "danger": "#E11D48",

        "focus-ring": "#0B66C3"
      },
      "gradients": {
        "allowed_usage": [
          "Hero background overlay only (<=20% viewport)",
          "Decorative section top strip (<=64px height)",
          "Large promo banner background (not behind long text)"
        ],
        "hero_overlay": "linear-gradient(90deg, rgba(6,43,91,0.92) 0%, rgba(6,43,91,0.55) 45%, rgba(6,43,91,0.15) 100%)",
        "promo_strip": "linear-gradient(90deg, rgba(254,194,15,0.22) 0%, rgba(255,210,77,0.10) 55%, rgba(255,255,255,0) 100%)"
      },
      "semantic": {
        "background": "--tc-surface",
        "foreground": "--tc-ink-900",
        "primary": "--tc-blue-700",
        "primary_foreground": "#FFFFFF",
        "accent": "--tc-yellow-500",
        "accent_foreground": "#1A1A1A",
        "muted": "--tc-surface-2",
        "muted_foreground": "--tc-ink-500",
        "border": "--tc-border",
        "ring": "--tc-focus-ring"
      }
    },

    "typography": {
      "google_fonts": [
        {
          "family": "Manrope",
          "weights": ["400", "500", "600", "700", "800"],
          "usage": "Primary UI font for body, nav, forms, cards (clean corporate)."
        },
        {
          "family": "Playfair Display",
          "weights": ["600", "700"],
          "usage": "Hero headline + section titles for premium travel feel (sparingly)."
        }
      ],
      "tailwind_mapping": {
        "font-sans": "Manrope, ui-sans-serif, system-ui",
        "font-display": "Playfair Display, ui-serif"
      },
      "scale": {
        "h1": "text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight",
        "h2": "text-base md:text-lg font-sans font-semibold text-ink-900",
        "h3": "text-lg font-sans font-semibold",
        "body": "text-sm md:text-base font-sans text-ink-700 leading-relaxed",
        "small": "text-xs text-ink-500"
      }
    },

    "spacing": {
      "page_gutters": "px-4 sm:px-6 lg:px-8",
      "max_width": "max-w-7xl",
      "section_padding": "py-10 sm:py-12 lg:py-16",
      "card_padding": "p-4 sm:p-5",
      "dense_row_gap": "gap-3 sm:gap-4",
      "comfortable_row_gap": "gap-6 sm:gap-8"
    },

    "radius": {
      "card": "rounded-2xl",
      "input": "rounded-xl",
      "button": "rounded-xl",
      "pill": "rounded-full"
    },

    "shadows": {
      "card": "shadow-[0_10px_30px_rgba(6,43,91,0.08)]",
      "card_hover": "hover:shadow-[0_14px_40px_rgba(6,43,91,0.14)]",
      "sticky_header": "shadow-[0_8px_24px_rgba(11,18,32,0.10)]"
    }
  },

  "global_css_updates": {
    "files": ["/app/frontend/src/index.css", "/app/frontend/src/App.css"],
    "instructions": [
      "Replace default shadcn tokens in index.css :root with Thomas Cook tokens (HSL values derived from hex).",
      "Remove CRA demo styles in App.css (App-header etc.) and keep App.css minimal or empty.",
      "Add a subtle noise overlay utility (CSS class) for hero/promo only (opacity <= 0.06).",
      "Do NOT add .App { text-align:center } anywhere."
    ],
    "css_custom_properties": {
      "add_to_:root": {
        "--tc-blue-900": "#062B5B",
        "--tc-blue-800": "#033E7E",
        "--tc-blue-700": "#0354A6",
        "--tc-blue-600": "#0B66C3",
        "--tc-blue-100": "#E8F1FF",
        "--tc-yellow-500": "#FEC20F",
        "--tc-yellow-400": "#FFD24D",
        "--tc-yellow-100": "#FFF6D6",
        "--tc-ink-900": "#0B1220",
        "--tc-ink-700": "#2A3446",
        "--tc-ink-500": "#5B667A",
        "--tc-surface": "#FFFFFF",
        "--tc-surface-2": "#F6F8FC",
        "--tc-border": "#E3E8F2",
        "--tc-focus-ring": "#0B66C3",
        "--tc-radius-card": "16px",
        "--tc-radius-input": "14px",
        "--tc-radius-button": "14px"
      },
      "noise_utility": {
        "class": ".tc-noise",
        "css": "position: relative;\n.tc-noise:before{content:'';position:absolute;inset:0;pointer-events:none;background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.18%22/%3E%3C/svg%3E');opacity:.06;mix-blend-mode:multiply;}"
      }
    }
  },

  "component_path": {
    "shadcn_primary": [
      "/app/frontend/src/components/ui/button.jsx",
      "/app/frontend/src/components/ui/card.jsx",
      "/app/frontend/src/components/ui/tabs.jsx",
      "/app/frontend/src/components/ui/input.jsx",
      "/app/frontend/src/components/ui/select.jsx",
      "/app/frontend/src/components/ui/slider.jsx",
      "/app/frontend/src/components/ui/accordion.jsx",
      "/app/frontend/src/components/ui/table.jsx",
      "/app/frontend/src/components/ui/pagination.jsx",
      "/app/frontend/src/components/ui/sheet.jsx",
      "/app/frontend/src/components/ui/navigation-menu.jsx",
      "/app/frontend/src/components/ui/carousel.jsx",
      "/app/frontend/src/components/ui/sonner.jsx"
    ],
    "icons": {
      "library": "lucide-react",
      "usage": "Use lucide icons for nav, feature bullets, trust badges. No emoji icons."
    }
  },

  "layout": {
    "grid": {
      "container": "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
      "columns": {
        "homepage_sections": "grid grid-cols-1 lg:grid-cols-12 gap-6",
        "listing_page": "grid grid-cols-1 lg:grid-cols-12 gap-6",
        "cards_grid": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      }
    },
    "header": {
      "type": "sticky",
      "classes": "sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-[color:var(--tc-border)]",
      "desktop_structure": [
        "Top utility strip (optional): contact, offers link, store locator (height 32px)",
        "Main row: logo left, nav center, actions right (login/account + cart/booking)",
        "Secondary row (homepage only): search tabs bar can sit below header overlapping hero"
      ],
      "nav_items": ["Holidays", "Flights", "Forex", "FAQ"],
      "data_testids": {
        "header": "site-header",
        "nav": "site-primary-nav",
        "login_button": "header-login-button",
        "account_menu": "header-account-menu"
      }
    },
    "footer": {
      "style": "Rich corporate footer with multiple columns, trust badges, social links, and legal.",
      "classes": "bg-[color:var(--tc-blue-900)] text-white",
      "data_testids": {
        "footer": "site-footer"
      }
    }
  },

  "page_guidelines": {
    "home": {
      "sections_order": [
        "Hero with destination image + multi-tab search",
        "Offers For You (banner cards)",
        "Tourism Board Recommends (logo strip)",
        "Thomas Cook Specials (carousel/grid)",
        "Why Thomas Cook (feature highlights)",
        "Company statistics (legacy counters)",
        "Testimonials",
        "Footer"
      ],
      "hero": {
        "layout": "Full-width image with left-aligned copy; search module anchored near bottom of hero (overlapping next section by ~24px).",
        "height": "min-h-[520px] sm:min-h-[600px]",
        "background": {
          "image": "Use one high-quality travel image; apply hero_overlay gradient for text legibility.",
          "overlay_gradient": "use design_tokens.colors.gradients.hero_overlay",
          "image_urls": [
            "https://images.unsplash.com/photo-1642516864726-a243f416fc00?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1720250581797-ecf79300157b?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85"
          ]
        },
        "copy": {
          "headline": "Discover holidays crafted for India",
          "subhead": "Domestic escapes, international tours, flights and forex — all in one trusted place.",
          "cta_primary": "Explore Holidays",
          "cta_secondary": "View Offers"
        },
        "search_module": {
          "component": "Tabs + Card",
          "tabs": ["Holidays", "Flights", "Forex"],
          "classes": "rounded-2xl bg-white shadow-[0_18px_50px_rgba(6,43,91,0.18)] border border-[color:var(--tc-border)]",
          "tab_style": "Active tab: tc-blue-700 text-white; Inactive: white with tc-blue-700 text; underline indicator in tc-yellow-500.",
          "fields": {
            "holidays": ["From city", "To destination", "Month (Calendar)", "Travellers"],
            "flights": ["From", "To", "Depart date (Calendar)", "Return date (optional)", "Travellers/Class"],
            "forex": ["Currency", "Amount", "City"]
          },
          "cta": {
            "label": "Search",
            "style": "Yellow primary button"
          },
          "data_testids": {
            "tabs": "home-search-tabs",
            "holidays_tab": "home-search-tab-holidays",
            "flights_tab": "home-search-tab-flights",
            "forex_tab": "home-search-tab-forex",
            "submit": "home-search-submit-button"
          }
        }
      },
      "offers_for_you": {
        "layout": "3-up banner cards on desktop, horizontal scroll on mobile.",
        "card_style": "White card with left icon badge (yellow) + right chevron; subtle border.",
        "background_accent": "Optional promo_strip gradient behind the row only.",
        "data_testids": {
          "section": "home-offers-section",
          "offer_card": "home-offer-card"
        }
      },
      "tourism_board": {
        "layout": "Logo strip in a muted surface container; grayscale logos that colorize on hover.",
        "classes": "bg-[color:var(--tc-surface-2)] rounded-2xl p-4",
        "data_testids": {
          "section": "home-tourism-board-section"
        }
      },
      "specials": {
        "layout": "Carousel on mobile, 3-4 card grid on desktop.",
        "package_card": {
          "image_ratio": "aspect-[16/10]",
          "elements": ["Destination", "Duration chip", "Starting price", "Inclusions mini-row", "CTA"],
          "cta": "View Details",
          "data_testids": {
            "card": "home-special-package-card",
            "cta": "home-special-package-view-details"
          }
        }
      },
      "why_thomas_cook": {
        "layout": "4 feature tiles with icons; use tc-blue-100 background for icon circles.",
        "features": [
          "140+ years legacy",
          "Expert tour managers",
          "Trusted payments",
          "Pan-India support"
        ],
        "data_testids": {
          "section": "home-why-tc-section"
        }
      },
      "stats": {
        "layout": "Row of counters in a blue container with white text; yellow separators.",
        "classes": "bg-[color:var(--tc-blue-900)] text-white rounded-2xl",
        "stats": ["140+ years", "4000+ tours", "10L+ travellers", "50+ awards"],
        "motion": "Count-up animation on scroll (Framer Motion + requestAnimationFrame).",
        "data_testids": {
          "section": "home-stats-section"
        }
      },
      "testimonials": {
        "layout": "2-up cards on desktop, carousel on mobile.",
        "card_style": "White card, subtle border, star rating row in yellow.",
        "data_testids": {
          "section": "home-testimonials-section"
        }
      }
    },

    "holidays_listing": {
      "layout": "Left sidebar filters (sticky) + right results grid.",
      "filters": {
        "components": ["Accordion", "Checkbox", "Slider", "Select"],
        "groups": [
          "Destination",
          "Region",
          "Category (India/International)",
          "Price range (Slider)",
          "Duration"
        ],
        "sticky_classes": "lg:sticky lg:top-24",
        "data_testids": {
          "sidebar": "holidays-filters-sidebar",
          "price_slider": "holidays-filter-price-slider",
          "sort_select": "holidays-sort-select"
        }
      },
      "results": {
        "grid": "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5",
        "card": "Reuse package card style from homepage specials.",
        "empty_state": "Use shadcn Skeleton while loading; show friendly empty state with reset filters button.",
        "data_testids": {
          "results": "holidays-results-grid",
          "package_card": "holidays-package-card"
        }
      }
    },

    "package_detail": {
      "layout": "Hero image + sticky booking summary card on desktop.",
      "sections": ["Highlights", "Inclusions", "Itinerary (Accordion)", "Policies"],
      "cta": {
        "label": "Book Now",
        "style": "Yellow primary button, full-width on mobile",
        "data_testids": "package-book-now-button"
      },
      "itinerary": {
        "component": "Accordion",
        "data_testids": {
          "accordion": "package-itinerary-accordion"
        }
      }
    },

    "flights": {
      "layout": "Search form card + results list.",
      "search_form": {
        "component": "Card + Tabs (One-way/Round-trip)",
        "fields": ["From", "To", "Depart date (Calendar)", "Return date", "Travellers"],
        "data_testids": {
          "form": "flights-search-form",
          "submit": "flights-search-submit-button"
        }
      },
      "results": {
        "card": "White card with airline logo placeholder, times, duration, stops chip, price, select button.",
        "data_testids": {
          "result_card": "flights-result-card"
        }
      }
    },

    "forex": {
      "layout": "Rates table + product cards.",
      "rates_table": {
        "component": "Table",
        "style": "Header row in tc-blue-900 with white text; row hover uses tc-blue-100.",
        "data_testids": {
          "table": "forex-rates-table"
        }
      },
      "product_cards": {
        "layout": "3-up grid",
        "cards": ["Forex Card", "Currency Exchange", "International Money Transfer"],
        "data_testids": {
          "card": "forex-product-card"
        }
      }
    },

    "faq": {
      "component": "Accordion",
      "data_testids": {
        "accordion": "faq-accordion"
      }
    },

    "auth": {
      "layout": "Centered form column but page content left-aligned within card; background uses surface-2.",
      "login": {
        "components": ["Card", "Input", "Button", "Separator"],
        "google_button": "Secondary outline button with Google icon (lucide) and data-testid.",
        "data_testids": {
          "form": "login-form",
          "email": "login-email-input",
          "password": "login-password-input",
          "submit": "login-submit-button",
          "google": "login-google-button"
        }
      },
      "register": {
        "data_testids": {
          "form": "register-form",
          "submit": "register-submit-button"
        }
      }
    },

    "account": {
      "profile": {
        "layout": "Two-column on desktop: profile card + preferences; single column on mobile.",
        "data_testids": {
          "profile_card": "account-profile-card"
        }
      },
      "bookings": {
        "layout": "Table on desktop, cards on mobile.",
        "data_testids": {
          "bookings_list": "account-bookings-list"
        }
      }
    },

    "booking_success": {
      "layout": "Success state card with booking summary + next steps.",
      "accent": "Use tc-yellow-100 background badge + success icon.",
      "data_testids": {
        "page": "booking-success-page"
      }
    }
  },

  "components_spec": {
    "buttons": {
      "variants": {
        "primary": {
          "use": "Main CTAs (Search, Book Now)",
          "classes": "bg-[color:var(--tc-yellow-500)] text-[color:var(--tc-ink-900)] hover:bg-[color:var(--tc-yellow-400)] focus-visible:ring-2 focus-visible:ring-[color:var(--tc-focus-ring)]",
          "motion": "hover: translateY(-1px) + shadow increase; active: scale(0.98)"
        },
        "secondary": {
          "use": "Secondary actions",
          "classes": "bg-white text-[color:var(--tc-blue-700)] border border-[color:var(--tc-border)] hover:bg-[color:var(--tc-blue-100)]"
        },
        "ghost": {
          "use": "Nav utility links",
          "classes": "bg-transparent text-[color:var(--tc-ink-700)] hover:bg-[color:var(--tc-surface-2)]"
        }
      },
      "data_testid_rule": "Every Button must include data-testid describing role (e.g., package-book-now-button)."
    },

    "inputs": {
      "classes": "h-11 rounded-xl border border-[color:var(--tc-border)] bg-white focus-visible:ring-2 focus-visible:ring-[color:var(--tc-focus-ring)]",
      "placeholder": "Use ink-500 at 70% opacity.",
      "data_testid_rule": "Every input/select/calendar trigger must include data-testid."
    },

    "cards": {
      "base": "rounded-2xl border border-[color:var(--tc-border)] bg-white",
      "hover": "transition-shadow duration-200 hover:shadow-[0_14px_40px_rgba(6,43,91,0.14)]",
      "image": "Use AspectRatio component for consistent crops.",
      "badges": "Use Badge for duration/category; yellow background for promo badges only."
    },

    "tabs": {
      "use": "Homepage search module + flights one-way/round-trip.",
      "active": "bg-[color:var(--tc-blue-700)] text-white",
      "inactive": "bg-white text-[color:var(--tc-blue-700)]",
      "indicator": "Optional bottom border in tc-yellow-500"
    },

    "tables": {
      "use": "Forex rates, bookings.",
      "header": "bg-[color:var(--tc-blue-900)] text-white",
      "row_hover": "hover:bg-[color:var(--tc-blue-100)]"
    }
  },

  "motion": {
    "library": "Framer Motion",
    "principles": [
      "Entrance: fade + slight y (8-12px) for sections",
      "Hover: lift cards by 2px + shadow increase",
      "Tabs: spring underline slide",
      "Reduce motion: respect prefers-reduced-motion"
    ],
    "durations": {
      "fast": "150-200ms",
      "standard": "240-320ms"
    },
    "avoid": ["transition: all"]
  },

  "accessibility": {
    "requirements": [
      "WCAG AA contrast: yellow text on white is not allowed; use yellow as background with dark text.",
      "Visible focus rings using tc-focus-ring.",
      "Touch targets >= 44px height for primary actions.",
      "Use aria-labels for icon-only buttons."
    ]
  },

  "image_urls": {
    "hero": [
      {
        "url": "https://images.unsplash.com/photo-1642516864726-a243f416fc00?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "Coastal India scenic hero (blue-forward, works with navy overlay)",
        "category": "home-hero"
      },
      {
        "url": "https://images.unsplash.com/photo-1720250581797-ecf79300157b?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "Family on beach hero alternative",
        "category": "home-hero"
      }
    ],
    "international_city": [
      {
        "url": "https://images.unsplash.com/photo-1506606401543-2e73709cebb4?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "Night skyline for international packages card",
        "category": "package-card"
      },
      {
        "url": "https://images.unsplash.com/photo-1645451365229-676df30167f0?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "Dense city nightscape for specials carousel",
        "category": "home-specials"
      }
    ],
    "promo_textures": [
      {
        "url": "https://images.unsplash.com/photo-1516641051054-9df6a1aad654?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "Yellow dotted texture for offers banner background (use as subtle overlay only)",
        "category": "offers-banner"
      }
    ]
  },

  "libraries": {
    "framer_motion": {
      "use_cases": ["section entrance", "carousel transitions", "count-up stats"],
      "scaffold_js": "// Example: motion.section\n// <motion.section initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true, amount:0.2}} transition={{duration:0.28}} />"
    }
  },

  "instructions_to_main_agent": [
    "Pixel-faithful priority: replicate Thomas Cook India spacing density, card rounding, and blue/yellow hierarchy. Keep backgrounds mostly white.",
    "Update /app/frontend/src/index.css tokens to match tc-blue/tc-yellow; ensure shadcn components inherit these tokens.",
    "Remove CRA demo App.css styles; do not center the app.",
    "Homepage hero: implement Tabs-based search module with 3 tabs (Holidays/Flights/Forex) and a single prominent yellow Search button.",
    "Use shadcn Calendar for date fields (no native HTML date input).",
    "All interactive + key informational elements must include stable data-testid attributes (kebab-case, role-based).",
    "Avoid gradients except hero overlay/promo strip per restriction rules."
  ],

  "general_ui_ux_design_guidelines": "<General UI UX Design Guidelines>  \n    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.\n</General UI UX Design Guidelines>"
}
