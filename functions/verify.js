
const DESTINATION_URL = "https://www.profitableratecpmnetwork.com/du6xvbdhka?key=bb0b464d083d36cda3c9f845951fdc38";

export async function onRequestPost({ request, env }) {
  try {
    const form = await request.formData();
    const token = form.get("g-recaptcha-response");

    if (!token || typeof token !== "string") {
      return new Response("Please complete the reCAPTCHA.", {
        status: 400
      });
    }

    const result = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          secret: env.RECAPTCHA_SECRET,
          response: token
        })
      }
    );

    const verification = await result.json();

    if (!verification.success) {
      return new Response("Verification failed. Please try again.", {
        status: 403
      });
    }

    return Response.redirect(DESTINATION_URL, 303);
  } catch {
    return new Response("Verification error. Please try again.", {
      status: 500
    });
  }
}
