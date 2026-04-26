import dishApiRequest from "@/features/dishes/api/dish.api";
import { DishListResType } from "@/features/dishes/schemas/dish.schema";
import Image from "next/image";
import { Skeleton } from "@/shared/ui/skeleton";
import { LocalizedText } from "@/shared/ui/localized-text";
import { getLocale, getTranslations } from "next-intl/server";
import { resolveLocaleText } from "@/shared/lib/resolve-locale-text";
import type { AppLocale } from "@/shared/i18n/locale.types";
import { PriceDisplay } from "@/shared/ui/price-display";

export default async function LandingPage() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("landing");

  const featureItems = [
    t("features.freshIngredients"),
    t("features.fiveStarChef"),
    t("features.luxurySpace"),
    t("features.dedicatedService"),
  ];

  let dishList: DishListResType = [];

  try {
    const result = await dishApiRequest.list({
      page: 1,
      limit: 10,
    });
    dishList = result.payload.data.results;
  } catch (error) {
    console.error("Error fetching dishes:", error);
    dishList = [];
  }

  return (
    <div className="w-full bg-neutral-950 text-white">
      {/* HERO */}
      <div className="relative min-h-[90vh] flex items-center overflow-hidden bg-black">
        <div className="absolute top-0 right-0 w-1/2 h-full">
          <Image
            src="/food-hero.png"
            fill
            quality={100}
            alt={t("hero.featuredDishAlt")}
            className="object-contain object-top-right"
            style={{ mixBlendMode: "lighten" }}
          />
        </div>

        <div className="relative z-20 w-full px-8 sm:px-16 md:px-20 py-20 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-6 h-px bg-yellow-500/60" />
            <p className="text-xs tracking-[6px] uppercase text-yellow-500/80 font-light">
              {t("hero.fineDiningLabel")}
            </p>
          </div>

          <h1 className="leading-none">
            <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white">
              {t("hero.restaurantPrefix")}
            </span>
            <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl italic font-light text-yellow-400">
              {t("hero.restaurantName")}
            </span>
          </h1>

          <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-md pt-2">
            {t("hero.description")}
          </p>

          <div className="flex items-center gap-4 pt-1">
            <div className="w-10 h-px bg-yellow-500/30" />
            <p className="text-xs tracking-[5px] uppercase text-white/30">
              {t("hero.tagline")}
            </p>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-y border-yellow-500/20 py-5 px-8 flex flex-wrap justify-center gap-8 sm:gap-16">
        {featureItems.map((item) => (
          <div key={item} className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-yellow-500" />
            <span className="text-xs tracking-[3.5px] uppercase text-white/40 font-light">
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* MENU */}
      <section className="py-24 px-6 sm:px-16 md:px-24">
        <div className="text-center mb-16 space-y-4">
          <p className="text-xs tracking-[6px] uppercase text-yellow-500/70 font-light">
            {t("menu.title")}
          </p>

          <h2 className="text-4xl md:text-5xl font-bold">
            {t("menu.highlightPrefix")}{" "}
            <span className="font-extralight text-yellow-400">
              {t("menu.highlightAccent")}
            </span>
          </h2>

          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-px bg-yellow-600/30" />
            <div className="w-1.5 h-1.5 rotate-45 bg-yellow-500/60" />
            <div className="w-16 h-px bg-yellow-600/30" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* CAROUSEL */}
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6">
            {dishList && dishList.length > 0 ? (
              dishList.map((dish) => (
                <div
                  key={dish.id}
                  className="group min-w-[320px] md:min-w-[350px] lg:min-w-[380px] snap-start bg-neutral-900 rounded-lg overflow-hidden hover:shadow-xl hover:shadow-black/40 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={dish.image}
                      fill
                      quality={100}
                      alt={
                        resolveLocaleText(dish.name, locale) ||
                        t("menu.fallbackDishAlt")
                      }
                      className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-80 group-hover:brightness-100"
                    />

                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm border border-yellow-500/30 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full">
                      <PriceDisplay
                        price={dish.price}
                        priceUsd={dish.price_usd}
                        locale={locale}
                        className="items-end"
                        vndClassName="text-yellow-400 text-xs font-semibold"
                        usdClassName="text-[11px] text-yellow-200/70"
                      />
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-semibold text-white group-hover:text-yellow-400 transition-colors duration-300 leading-snug">
                      <LocalizedText text={dish.name} />
                    </h3>

                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                      <LocalizedText text={dish.description} />
                    </p>

                    <div className="pt-2 flex items-center gap-2">
                      <div className="flex-1 h-px bg-white/5" />
                      <span className="text-xs text-yellow-600/70 tracking-widest uppercase">
                        {t("menu.viewMore")}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-3">
                <Skeleton className="h-5 w-24 rounded-full" />
                <p className="text-xs text-white/50">
                  {t("menu.loadingDishes")}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <div className="relative py-28 overflow-hidden">
        <span className="absolute inset-0 bg-black/80 z-10" />

        <Image
          src="/banner.png"
          fill
          quality={100}
          alt={t("quote.brand")}
          className="object-cover object-center blur-sm brightness-50"
        />

        <div className="relative z-20 text-center px-6 space-y-6 max-w-2xl mx-auto">
          <div className="text-6xl text-yellow-500/30 font-serif leading-none"></div>

          <p className="text-xl sm:text-2xl font-light text-white/80 leading-relaxed italic">
            {t("quote.text")}
          </p>

          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-yellow-500/50" />
            <span className="text-xs tracking-[0.4em] uppercase text-yellow-500/60">
              {t("quote.brand")}
            </span>
            <div className="w-8 h-px bg-yellow-500/50" />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-8 sm:px-16 md:px-24">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
          <div>
            <h4 className="text-lg font-bold text-white">
              Viet<span className="font-extralight text-yellow-400">Food</span>
            </h4>
            <p className="text-xs text-neutral-600 mt-1 tracking-widest uppercase">
              {t("footer.tagline")}
            </p>
          </div>

          <p className="text-xs text-neutral-700">{t("footer.copyright")}</p>
        </div>
      </footer>
    </div>
  );
}
