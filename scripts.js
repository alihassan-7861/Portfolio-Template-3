/* ═══════════════════════════════════════════════════════
   EKIZR PORTFOLIO — script.js
═══════════════════════════════════════════════════════ */

      /* ─── INIT ON LOAD ─── */
      window.addEventListener("DOMContentLoaded", () => {
        initScrollObserver();
        initAll();
      });

      /* ─── UNIFIED STAGGER SCROLL OBSERVER ─── */
      function initScrollObserver() {
        // Collect all animatable elements — both reveal-* classes AND data-anim attributes
        const allEls = Array.from(
          document.querySelectorAll(
            "[data-anim], .reveal-top, .reveal-bottom, .reveal-left, .reveal-right, .reveal-fade, .reveal-badge",
          ),
        );

        // Normalise: ensure every element has a hidden initial state based on its direction
        allEls.forEach((el) => {
          const dir =
            el.dataset.anim ||
            (el.classList.contains("reveal-top") ? "from-top" : "") ||
            (el.classList.contains("reveal-bottom") ? "from-bottom" : "") ||
            (el.classList.contains("reveal-left") ? "from-left" : "") ||
            (el.classList.contains("reveal-right") ? "from-right" : "") ||
            (el.classList.contains("reveal-fade") ? "fade" : "") ||
            (el.classList.contains("reveal-badge") ? "from-top" : "");

          el._animDir = dir;

          // Force correct hidden state regardless of which class/attr was used
          el.style.opacity = "0";
          el.style.willChange = "opacity, transform";
          switch (dir) {
            case "from-top":
              el.style.transform = "translateY(-36px)";
              break;
            case "from-bottom":
              el.style.transform = "translateY(36px)";
              break;
            case "from-left":
              el.style.transform = "translateX(-48px)";
              break;
            case "from-right":
              el.style.transform = "translateX(48px)";
              break;
            case "fade":
              el.style.transform = "scale(0.93)";
              break;
            default:
              el.style.transform = "translateY(28px)";
              break;
          }
        });

        // Group elements by their nearest section/panel ancestor
        const groupMap = new Map();
        allEls.forEach((el) => {
          const group =
            el.closest(
              "#home, #about, #portfolio, #contact, .contact-left, .contact-right",
            ) || el.parentElement;
          if (!groupMap.has(group)) groupMap.set(group, []);
          groupMap.get(group).push(el);
        });

        // Reveal helper
        function revealEl(el) {
          el.style.transition =
            "opacity 0.65s cubic-bezier(0.4,0,0.2,1), transform 0.65s cubic-bezier(0.34,1.1,0.64,1)";
          el.style.opacity = "1";
          el.style.transform = "none";
        }

        // One IntersectionObserver per group — stagger 120ms per child
        groupMap.forEach((els, group) => {
          let fired = false;
          const io = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting || fired) return;
                fired = true;
                io.disconnect();
                els.forEach((el, i) => setTimeout(() => revealEl(el), i * 120));
              });
            },
            { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
          );

          io.observe(group);
        });

        // Grid cards (project / cert / tech) — stagger per grid container
        observeGridCards(".project-card", 100);
        observeGridCards(".cert-card", 90);
        observeGridCards(".tech-card", 70);
        observeGridCards(".tab-btn", 100);

        // Contact form fields — sequential one-by-one
        observeContactFields();
      }

      function observeGridCards(selector, gap) {
        const grids = new Map();
        document.querySelectorAll(selector).forEach((card) => {
          const parent = card.parentElement;
          if (!grids.has(parent)) grids.set(parent, []);
          grids.get(parent).push(card);
        });

        grids.forEach((cards, parent) => {
          // Set initial hidden state
          cards.forEach((c) => {
            c.style.opacity = "0";
            c.style.transform = "translateY(32px)";
            c.style.transition =
              "opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.34,1.15,0.64,1)";
          });

          const io = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                io.disconnect();
                cards.forEach((c, i) => {
                  setTimeout(() => {
                    c.style.opacity = "1";
                    c.style.transform = "translateY(0)";
                  }, i * gap);
                });
              });
            },
            { threshold: 0.08 },
          );

          io.observe(parent);
        });
      }

      function observeContactFields() {
        // Stagger left panel fields
        const leftFields = document.querySelectorAll(
          ".contact-left  .cf-1, .contact-left  .cf-2, .contact-left  .cf-3, .contact-left  .cf-4",
        );
        const rightFields = document.querySelectorAll(
          ".contact-right .crf-1, .contact-right .crf-2, .contact-right .crf-3, .contact-right .crf-4",
        );

        function animateGroup(fields, panelEl) {
          if (!panelEl) return;
          const io = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                io.disconnect();
                fields.forEach((f, i) => {
                  setTimeout(() => {
                    f.style.opacity = "1";
                    f.style.transform = "translateY(0)";
                  }, i * 160);
                });
              });
            },
            { threshold: 0.15 },
          );
          io.observe(panelEl);
        }

        animateGroup(leftFields, document.querySelector(".contact-left"));
        animateGroup(rightFields, document.querySelector(".contact-right"));
      }

      /* ─── TYPEWRITER ─── */
      function initTypewriter() {
        const el = document.querySelector(".hero-sub");
        if (!el) return;

        const phrases = [
          "Network & Telecom Student",
          "Frontend Developer",
          "UI/UX Enthusiast",
          "Open Source Contributor",
        ];

        let phraseIdx = 0,
          charIdx = 0,
          deleting = false;
        const baseText = ""; // el contains the full text at start, we take over

        // Replace content with typewriter span
        el.innerHTML =
          '<span class="typewriter-target"></span><span class="cursor-blink">|</span>';
        const tw = el.querySelector(".typewriter-target");

        function tick() {
          const current = phrases[phraseIdx];
          if (!deleting) {
            charIdx++;
            tw.textContent = current.slice(0, charIdx);
            if (charIdx === current.length) {
              deleting = true;
              return setTimeout(tick, 1800);
            }
          } else {
            charIdx--;
            tw.textContent = current.slice(0, charIdx);
            if (charIdx === 0) {
              deleting = false;
              phraseIdx = (phraseIdx + 1) % phrases.length;
            }
          }
          setTimeout(tick, deleting ? 60 : 90);
        }

        setTimeout(tick, 1200);
      }

      /* ─── NAVBAR SCROLL EFFECT ─── */
      function initNavbar() {
        const nav = document.getElementById("navbar");
        window.addEventListener(
          "scroll",
          () => {
            nav.classList.toggle("scrolled", window.scrollY > 20);

            // Update active link
            const sections = ["home", "about", "portfolio", "contact"];
            let current = "home";
            sections.forEach((id) => {
              const el = document.getElementById(id);
              if (el && window.scrollY >= el.offsetTop - 80) current = id;
            });
            document.querySelectorAll(".nav-link").forEach((a) => {
              a.classList.toggle(
                "active",
                a.getAttribute("href") === `#${current}`,
              );
            });
          },
          { passive: true },
        );

        // Smooth scroll on link click
        document.querySelectorAll('a[href^="#"]').forEach((a) => {
          a.addEventListener("click", (e) => {
            const target = document.getElementById(
              a.getAttribute("href").slice(1),
            );
            if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior: "smooth", block: "start" });
              // Close mobile menu if open
              document.querySelector(".nav-links")?.classList.remove("open");
            }
          });
        });

        // Hamburger
        document.getElementById("hamburger")?.addEventListener("click", () => {
          document.querySelector(".nav-links")?.classList.toggle("open");
        });
      }

      /* ─── PORTFOLIO TABS ─── */
      function initTabs() {
        const btns = document.querySelectorAll(".tab-btn");
        const contents = document.querySelectorAll(".tab-content");

        btns.forEach((btn) => {
          btn.addEventListener("click", () => {
            const tab = btn.dataset.tab;

            btns.forEach((b) => b.classList.remove("active"));
            contents.forEach((c) => c.classList.remove("active"));

            btn.classList.add("active");
            document.getElementById(`tab-${tab}`)?.classList.add("active");
          });
        });
      }

      /* ─── PROJECT DETAIL OVERLAY ─── */
      const projectData = {
        aritmatika: {
          title: "Aritmatika Solver",
          desc: "Program ini dirancang untuk mempermudah pengguna dalam menyelesaikan soal-soal Aritmatika secara otomatis. Sistem menggunakan algoritma cerdas untuk menganalisis dan menyelesaikan berbagai jenis persoalan matematika dengan cepat dan akurat.",
          techs: ["ReactJS", "Tailwind CSS", "Vite", "JavaScript"],
          features: [
            "Selesaikan soal aritmatika otomatis.",
            "Tampilkan langkah penyelesaian detail.",
            "Antarmuka yang ramah pengguna.",
            "Mendukung berbagai jenis operasi matematika.",
          ],
          totalTech: 4,
          totalHours: 2,
          previewTitle: "Aritmatika Solver",
          previewSub: "Solve math problems effortlessly!",
        },
        autochat: {
          title: "AutoChat-Discord",
          desc: "AutoChat adalah solusi otomatisasi untuk mengirim pesan ke saluran Discord secara terjadwal. Pengguna dapat menentukan saluran tujuan, isi pesan, dan interval pengiriman pesan. Program ini berjalan 24/7, memungkinkan pengiriman pesan otomatis tanpa intervensi manual, sehingga memudahkan promosi atau komunikasi di Discord secara efisien.",
          techs: [
            "ReactJS",
            "AOS",
            "Tailwind CSS",
            "Material UI",
            "Python",
            "Firebase",
            "Sweetalert2",
            "Vite",
            "CSS",
          ],
          features: [
            "Customize the message content as needed.",
            "Send messages to multiple Discord channels simultaneously.",
            "Set custom delay intervals between messages for controlled messaging.",
            "AutoChat runs non-stop to ensure continuous messaging.",
          ],
          totalTech: 8,
          totalHours: 4,
          previewTitle: "AutoChat-Discord",
          previewSub: "Automate Your Discord Messages Effortlessly!",
        },
        buku: {
          title: "Buku Catatan",
          desc: "Buku Catatan adalah website yang memungkinkan pengguna untuk membuat, menyimpan, dan mengelola catatan digital mereka. Dengan antarmuka yang bersih dan intuitif, pengguna dapat mengorganisir catatan berdasarkan kategori dan tanggal.",
          techs: ["HTML", "CSS", "JavaScript", "LocalStorage"],
          features: [
            "Buat dan simpan catatan digital.",
            "Organisir catatan dengan kategori.",
            "Pencarian catatan yang cepat.",
            "Antarmuka bersih dan responsif.",
          ],
          totalTech: 4,
          totalHours: 3,
          previewTitle: "Buku Catatan",
          previewSub: "Simpan dan kelola catatan Anda",
        },
        city: {
          title: "City Explorer",
          desc: "Platform eksplorasi kota yang menampilkan informasi wisata, kuliner, dan budaya secara interaktif. Pengguna dapat menemukan destinasi wisata terbaik, restoran lokal, dan atraksi budaya dengan fitur pencarian dan filter canggih.",
          techs: ["ReactJS", "Tailwind CSS", "Firebase", "Google Maps API"],
          features: [
            "Jelajahi berbagai destinasi wisata.",
            "Filter berdasarkan kategori dan lokasi.",
            "Tampilkan peta interaktif.",
            "Informasi lengkap setiap destinasi.",
          ],
          totalTech: 4,
          totalHours: 5,
          previewTitle: "City Explorer",
          previewSub: "Discover amazing places near you",
        },
        perbaiki: {
          title: "IT Support Service",
          desc: "Platform layanan perbaikan IT profesional dengan sistem booking dan tracking real-time. Menghubungkan pengguna yang membutuhkan bantuan teknis dengan teknisi IT berpengalaman di area mereka.",
          techs: [
            "ReactJS",
            "Node.js",
            "Firebase",
            "Tailwind CSS",
            "Material UI",
          ],
          features: [
            "Booking layanan IT online.",
            "Tracking status perbaikan real-time.",
            "Direktori teknisi terverifikasi.",
            "Sistem rating dan ulasan.",
          ],
          totalTech: 5,
          totalHours: 6,
          previewTitle: "IT Support",
          previewSub: "Perbaiki Masalah IT Dengan Cepat",
        },
        "portfolio-self": {
          title: "Personal Portfolio",
          desc: "Portfolio website pribadi yang menampilkan karya, skill, dan pengalaman profesional sebagai Frontend Developer. Dibangun dengan teknologi modern dan animasi yang menarik untuk memberikan pengalaman terbaik bagi pengunjung.",
          techs: [
            "ReactJS",
            "Tailwind CSS",
            "Framer Motion",
            "Vite",
            "Firebase",
          ],
          features: [
            "Showcase proyek dan karya terbaik.",
            "Animasi smooth dan interaktif.",
            "Fully responsive di semua device.",
            "Formulir kontak terintegrasi.",
          ],
          totalTech: 5,
          totalHours: 4,
          previewTitle: "Portfolio",
          previewSub: "I'm Eki Zulfar Rachman",
        },
      };

      function initProjectDetails() {
        const overlay = document.getElementById("project-detail");
        const backBtn = document.getElementById("pd-back");

        document.querySelectorAll(".project-detail-link").forEach((link) => {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const key = link.dataset.project;
            const data = projectData[key];
            if (!data) return;

            // Populate
            document.getElementById("pd-title").textContent = data.title;
            document.getElementById("pd-title-crumb").textContent = data.title;
            document.getElementById("pd-desc").textContent = data.desc;

            // Tech tags
            const tagsEl = document.getElementById("pd-tech-tags");
            tagsEl.innerHTML = data.techs
              .map((t) => `<span class="tag">${t}</span>`)
              .join("");

            // Meta
            overlay.querySelectorAll(".pd-meta-item span")[0].textContent =
              data.totalTech;
            overlay.querySelectorAll(".pd-meta-item span")[1].textContent =
              data.totalHours;

            // Features
            document.getElementById("pd-features-list").innerHTML =
              data.features.map((f) => `<li>${f}</li>`).join("");

            // Preview
            overlay.querySelector(".pd-preview-hero").innerHTML =
              `${data.previewSub.replace("!", "<br><span>Effortlessly!</span>")}`;

            overlay.classList.remove("hidden");
            overlay.classList.add("show");
            document.body.style.overflow = "hidden";
            overlay.scrollTo(0, 0);
          });
        });

        // Card click (anywhere except detail link)
        document.querySelectorAll(".project-card").forEach((card) => {
          card.addEventListener("click", (e) => {
            if (
              e.target.closest(".project-detail-link") ||
              e.target.closest(".link-demo")
            )
              return;
            const key = card.dataset.project;
            card.querySelector(".project-detail-link")?.click();
          });
        });

        backBtn?.addEventListener("click", () => {
          overlay.classList.add("hidden");
          overlay.classList.remove("show");
          document.body.style.overflow = "";
        });
      }

      /* ─── STAT COUNTER ANIMATION ─── */
      function initCounters() {
        const stats = document.querySelectorAll(".stat-num");
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const el = entry.target;
                const end = parseInt(el.textContent);
                let current = 0;
                const step = Math.ceil(end / 30);
                const timer = setInterval(() => {
                  current = Math.min(current + step, end);
                  el.textContent = current;
                  if (current >= end) clearInterval(timer);
                }, 40);
                io.unobserve(el);
              }
            });
          },
          { threshold: 0.5 },
        );
        stats.forEach((el) => io.observe(el));
      }

      /* ─── TECH CARD HOVER GLOW ─── */
      function initTechHover() {
        document.querySelectorAll(".tech-card").forEach((card) => {
          card.addEventListener("mouseenter", () => {
            card.style.boxShadow = "0 0 24px rgba(139,92,246,0.4)";
          });
          card.addEventListener("mouseleave", () => {
            card.style.boxShadow = "";
          });
        });
      }

      /* ─── CURSOR GLOW (desktop) ─── */
      function initCursorGlow() {
        if (window.matchMedia("(hover:none)").matches) return;
        const glow = document.createElement("div");
        glow.style.cssText = `
    position:fixed; pointer-events:none; z-index:9998;
    width:300px; height:300px; border-radius:50%;
    background: radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%);
    transform:translate(-50%,-50%); transition:left 0.15s ease,top 0.15s ease;
  `;
        document.body.appendChild(glow);
        document.addEventListener("mousemove", (e) => {
          glow.style.left = e.clientX + "px";
          glow.style.top = e.clientY + "px";
        });
      }

      /* ─── INIT ALL ─── */
      function initAll() {
        initTypewriter();
        initNavbar();
        initTabs();
        initProjectDetails();
        initCounters();
        initTechHover();
        initCursorGlow();
      }
