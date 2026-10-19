"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    text: "Pehle mujhe lagta tha ki yoga mere liye nahi hai. Weight gain ki wajah se confidence bhi kaafi kam ho gaya tha aur din bhar body heavy feel hoti thi. Sabse badi problem ye thi ki main khud ke liye time hi nahi nikal paati thi. Navigate Skill Yoga join karne ke baad mujhe laga ki yahan sirf yoga nahi sikhaya jata, balki aapko samjha bhi jata hai. Classes bahut beginner-friendly hain aur teachers kabhi pressure nahi dete. Dheere-dheere mera stamina improve hua, body light feel hone lagi aur sabse important, mujhe khud par fir se confidence aane laga. Aaj main physically hi nahi, mentally bhi bahut better feel karti hoon.",
    name: "Student",
    rating: 5
  },
  {
    id: 2,
    text: "Main ek working professional hoon aur mera zyada tar time office chair ya car mein hi nikalta hai. Is wajah se back pain, stiffness aur stress meri daily life ka part ban gaye the. Ghar aate-aate itni thakan ho jaati thi ki kisi cheez ka mann hi nahi karta tha. Navigate Skill Yoga join karne ke baad mujhe samajh aaya ki fitness sirf weight loss ka naam nahi hai. Regular classes ki wajah se meri flexibility improve hui, stiffness kam hui aur stress levels bhi kaafi control mein aaye. Sabse achhi baat ye lagi ki instructors har level ke students ko equally guide karte hain. Ab main pehle se zyada energetic aur active feel karta hoon.",
    name: "Working Professional",
    rating: 5
  },
  {
    id: 3,
    text: "Shaadi ke baad aur family responsibilities ke beech maine khud par dhyan dena lagbhag chhod hi diya tha. Weight badh gaya tha, stress rehta tha aur neend bhi properly nahi aati thi. Kabhi-kabhi lagta tha ki main apne purane wale version se bahut door ho gayi hoon. Phir maine Navigate Skill Yoga join kiya. Honestly, mujhe weight loss se zyada zarurat thi apne aap ko fir se feel karne ki. Yahan ki classes ne mujhe ek routine diya, ek positive space diya aur dheere-dheere meri health bhi improve hone lagi. Aaj bhi journey chal rahi hai, lekin ab mujhe lagta hai ki main sahi direction mein hoon. Aur shayad yehi sabse badi feeling hai.",
    name: "Homemaker",
    rating: 5
  },
  {
    id: 4,
    text: "Main hamesha se active nahi thi. Sach kahun toh weight gain ke baad maine bahar jana, photos click karna aur logon se milna bhi kam kar diya tha. Log kehte the 'bas thoda exercise kar lo', lekin jab motivation hi na ho toh shuru karna bhi mushkil lagta hai. Navigate Skill Yoga join karne ke baad mujhe pehli baar laga ki koi meri situation ko samajh raha hai. Yahan kisi ne mujhe judge nahi kiya. Dheere-dheere routine bana, body halka lagne lagi aur confidence wapas aane laga. Aaj bhi perfect nahi hoon, lekin pehle se bahut better hoon.",
    name: "Student",
    rating: 5
  },
  {
    id: 5,
    text: "Meri problem sirf weight nahi thi, stress bhi bahut zyada tha. Din bhar kaam aur responsibilities ke beech lagta tha ki main khud ko hi bhool gayi hoon. Har raat sochti thi kal se kuch start karungi, lekin kal kabhi aata hi nahi tha. Navigate Skill Yoga ne mujhe sirf yoga nahi diya, ek routine diya. Ab main din ke 60 minutes sirf apne liye nikalti hoon. Ye 60 minutes meri mental peace ke liye bahut important ban gaye hain.",
    name: "Working Professional",
    rating: 5
  },
  {
    id: 6,
    text: "Main 45 saal ki hoon aur honestly mujhe lagta tha ki ab body mein flexibility wapas nahi aa sakti. Knee pain aur stiffness ki wajah se normal activities bhi difficult lagne lagi thi. Navigate Skill Yoga join karne ke baad mujhe realise hua ki age problem nahi hoti, galat routine problem hoti hai. Classes bahut gentle hain aur har session ke baad body pehle se zyada relaxed feel hoti hai. Sabse achhi baat ye hai ki mujhe fir se movement ka confidence mila.",
    name: "Senior Student",
    rating: 5
  },
  {
    id: 7,
    text: "PCOD ki wajah se weight gain aur mood swings dono handle karna bahut difficult ho gaya tha. Kabhi-kabhi lagta tha ki main kitni bhi mehnat kar loon, result nahi aayega. Navigate Skill Yoga join karne ke baad mujhe support mila. Yahan har cheez step-by-step samjhayi jaati hai. Mujhe laga tha sirf yoga hoga, lekin yahan discipline aur self-care bhi seekhne ko mila. Is journey ne mujhe mentally bahut strong banaya hai.",
    name: "Student",
    rating: 5
  },
  {
    id: 8,
    text: "Main ek software engineer hoon aur mera pura din laptop ke saamne guzarta hai. Back pain aur neck stiffness itni common ho gayi thi ki maine use normal maan liya tha. Navigate Skill Yoga ki classes join karne ke kuch hafton baad hi mujhe difference feel hone laga. Ab office ke baad body toot-ti nahi hai. Energy level bhi improve hua hai aur stress manage karna pehle se kaafi easy lagta hai.",
    name: "Software Engineer",
    rating: 5
  },
  {
    id: 9,
    text: "Mujhe neend ki problem thi. Raat bhar overthinking chalti rehti thi aur subah uthkar fresh feel hi nahi hota tha. Iska effect meri health aur mood dono par pad raha tha. Navigate Skill Yoga mein breathing aur relaxation practices ne meri kaafi help ki. Dheere-dheere sleep pattern improve hua aur mind bhi calm rehne laga. Sabse achha feeling ye tha ki maine khud ko fir se prioritize karna shuru kiya.",
    name: "Student",
    rating: 5
  },
  {
    id: 10,
    text: "Maine pehle bhi bahut baar fitness journey start ki thi, lekin har baar 10–15 din baad chhod deta tha. Problem motivation ki nahi thi, consistency ki thi. Navigate Skill Yoga ki live classes ne mujhe accountable rakha. Jab aapko pata hota hai ki class hai aur teacher wait kar raha hai, toh aap serious ho jaate ho. Isi consistency ne meri life mein actual change laaya.",
    name: "Student",
    rating: 5
  },
  {
    id: 11,
    text: "Meri mummy ne mujhe force karke yoga join karwaya tha aur honestly mujhe laga tha ki ye boring hoga. Lekin kuch hi classes ke baad mujhe samajh aa gaya ki yoga sirf stretching nahi hai. Navigate Skill Yoga ne mujhe physically strong banane ke saath mentally bhi calm kiya. Ab classes miss ho jaayein toh lagta hai routine incomplete hai.",
    name: "Student",
    rating: 5
  },
  {
    id: 12,
    text: "Weight gain ke baad mujhe sabse zyada problem apne kapdon se hone lagi thi. Har baar shopping karte waqt confidence down ho jata tha. Ye baat shayad sirf wahi log samajh sakte hain jo is phase se guzre hain. Navigate Skill Yoga join karne ke baad meri thinking hi change ho gayi. Focus sirf weight par nahi raha, health par aa gaya. Aur jab health improve hui, confidence automatically wapas aane laga.",
    name: "Student",
    rating: 5
  },
  {
    id: 13,
    text: "Main kisi miracle ya shortcut ki talaash mein nahi thi. Mujhe bas ek aisa routine chahiye tha jo main realistically follow kar sakun. Isi wajah se maine Navigate Skill Yoga choose kiya. Yahan koi unrealistic promises nahi kiye jaate. Bas daily effort, proper guidance aur consistency. Shayad isi wajah se mujhe yahan trust feel hua. Aur aaj mujhe lagta hai ki ye decision mere liye worth it tha.",
    name: "Student",
    rating: 5
  },
  {
    id: 14,
    text: "Pregnancy ke baad mera pura routine change ho gaya tha. Baby ki care ke beech khud ke liye time nikalna almost impossible lagta tha. Body weak feel hoti thi aur energy bhi pehle jaisi nahi rahi thi. Navigate Skill Yoga join karne ke baad maine dheere-dheere apni health par focus karna shuru kiya. Classes ka pace comfortable tha aur kisi bhi cheez ki jaldi nahi thi. Kuch hi hafton mein mujhe body mein strength aur flexibility dono feel hone lagi. Sabse achhi baat ye thi ki mujhe apne liye bhi time nikalne ki habit wapas mil gayi.",
    name: "Post-Pregnancy Recovery",
    rating: 5
  },
  {
    id: 15,
    text: "Main bahut jaldi stress le leta tha. Chhoti-chhoti baatein bhi dimaag mein chalti rehti thi aur focus karna mushkil ho jata tha. Din bhar ka pressure raat tak saath rehta tha. Navigate Skill Yoga ne mujhe breathing techniques aur mindfulness ki importance samjhayi. Dheere-dheere maine notice kiya ki mera mind pehle se zyada calm rehne laga hai. Ab stressful situations ko handle karna pehle se kaafi easy lagta hai aur overall mental clarity bhi improve hui hai.",
    name: "Anxiety & Stress Management",
    rating: 5
  },
  {
    id: 16,
    text: "College life mein classes, assignments aur social life ke beech fitness ko time dena mushkil lagta tha. Main jaldi thak jaata tha aur energy levels bhi low rehte the. Navigate Skill Yoga join karne ke baad maine ek healthy routine develop kiya. Classes simple aur easy-to-follow hain, isliye consistency maintain karna bhi easy raha. Aaj main pehle se zyada active feel karta hoon aur daily activities mein bhi energy bani rehti hai.",
    name: "College Student",
    rating: 5
  },
  {
    id: 17,
    text: "Work from home ki wajah se mera screen time bahut badh gaya tha. Din bhar ek hi jagah baithne se body stiff rehti thi aur movement almost khatam ho gayi thi. Navigate Skill Yoga ne mujhe daily movement ki importance samjhayi. Regular practice se body ka stiffness kam hua aur posture bhi improve hua. Ab main kaam ke beech bhi zyada fresh aur productive feel karta hoon.",
    name: "Work From Home Professional",
    rating: 5
  },
  {
    id: 18,
    text: "Kuch saalon se maine apni health ko priority dena band kar diya tha. Is wajah se confidence bhi dheere-dheere kam ho gaya tha aur main khud ko pehle jaisa feel nahi karta tha. Navigate Skill Yoga join karne ke baad mujhe realise hua ki confidence sirf appearance se nahi aata, healthy feel karne se bhi aata hai. Jab body better feel karne lagi aur routine improve hua, toh confidence bhi naturally wapas aane laga. Aaj main khud ko pehle se zyada positive feel karta hoon.",
    name: "Self-Confidence Journey",
    rating: 5
  },
  {
    id: 19,
    text: "Meri subah hamesha rush mein shuru hoti thi. Jaldi uthna mushkil lagta tha aur poora din lethargic feel hota tha. Mujhe lagta tha ki meri lifestyle hi aisi hai aur kuch change nahi ho sakta. Navigate Skill Yoga ne meri mornings completely change kar di. Ab din ki shuruaat yoga aur breathing exercises se hoti hai. Isse poore din energy bani rehti hai aur mood bhi positive rehta hai. Yeh routine meri life ka important part ban chuka hai.",
    name: "Better Morning Routine",
    rating: 5
  },
  {
    id: 20,
    text: "Mujhe joints mein pain aur body stiffness ki problem rehti thi. Seedhiyan chadhna ya thoda zyada chalna bhi kabhi-kabhi uncomfortable lagta tha. Is wajah se physical activities se bachne laga tha. Navigate Skill Yoga join karne ke baad mujhe samajh aaya ki regular movement kitna important hai. Instructors ne har exercise ko properly guide kiya aur meri comfort ko bhi dhyan mein rakha. Aaj pain kaafi kam feel hota hai aur movement pehle se bahut smooth lagti hai. Sabse important baat, mujhe apni body par fir se trust feel hone laga hai.",
    name: "Joint Pain Relief",
    rating: 5
  }
];

export function Testimonials() {
  const [showAll, setShowAll] = useState(false);
  const initialCount = 3;

  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, initialCount);

  return (
    <section className="py-12 lg:py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50 to-white" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <span className="text-sm font-medium text-purple-600">💬 Student Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
            What Our <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-fuchsia-600">Students Say</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real stories from real people who transformed their lives with Navigate Skill Yoga
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayedTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center">
                  <Quote className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{testimonial.name}</p>
                </div>
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {testimonial.text}
              </p>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {!showAll && testimonials.length > initialCount && (
          <div className="flex items-center justify-center">
            <button
              onClick={() => setShowAll(true)}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all duration-300"
            >
              Show More ({testimonials.length - initialCount} more)
            </button>
          </div>
        )}

        {/* Show Less Button */}
        {showAll && (
          <div className="flex items-center justify-center">
            <button
              onClick={() => setShowAll(false)}
              className="px-8 py-3 rounded-full bg-white border-2 border-purple-200 text-purple-600 font-semibold hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
            >
              Show Less
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
