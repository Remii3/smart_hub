export default function AboutUsPage() {
  return (
    <div className="px-4">
      <article className="relative flex items-center">
        <section className="absolute bottom-28 left-1/2 z-20 w-full -translate-x-1/2 transform md:static md:w-auto md:basis-[50%] md:translate-x-0 md:transform-none ">
          <div className="max-w-xl">
            <h2 className="mb-4 text-5xl md:text-6xl">About us</h2>
            <div className="text-xl md:text-lg">
              We are a group of people who came up with the idea of making it
              easier for rookie authors to share their work with the world!
            </div>
          </div>
        </section>
        <div className="opacity-20 md:basis-[50%] md:opacity-100">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2FAboutUs.webp?alt=media&token=c6ba5ddc-7217-4b8b-a07f-64ffd36762e2&_gl=1*mx4vw*_ga*NDYxNzIyMDYxLjE2OTU3NTEwNzA.*_ga_CW55HF8NVT*MTY5OTE5ODg3MS42Ny4xLjE2OTkxOTkwNzcuNjAuMC4w"
            alt="aboutUs_img"
            className="h-full w-full"
          />
        </div>
      </article>
      <article className="relative flex items-center">
        <div className="opacity-20 md:basis-[50%] md:opacity-100">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2FOurMission.webp?alt=media&token=14c226fc-a4c4-4082-aa74-4ffc6fc01c7b&_gl=1*1jubk71*_ga*NDYxNzIyMDYxLjE2OTU3NTEwNzA.*_ga_CW55HF8NVT*MTY5OTE5ODg3MS42Ny4xLjE2OTkxOTkwOTQuNDMuMC4w"
            alt="ourMission_img"
            className="h-full w-full max-w-lg"
          />
        </div>
        <section className="absolute bottom-28 left-1/2 z-20 w-full -translate-x-1/2 transform md:static md:flex md:w-auto md:basis-[50%] md:translate-x-0 md:transform-none md:justify-end">
          <div className=" max-w-xl">
            <h2>Our mission</h2>
            <div className="text-lg">
              Our aim is to gather a community of authors and share their
              opinion of our solution with the rest of the authors community.
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
