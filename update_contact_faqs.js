const fs = require('fs');

const flattenFaqs1 = `[
                            { q: "What is NavigateSkills Academy?", a: "NavigateSkills Academy is a premier online learning platform offering specialized courses. We connect you with expert instructors for strictly live, interactive training sessions." },
                            { q: "How do I enroll in a course?", a: "Simply browse our 'Explore' page, select the course you're interested in, and click 'Enroll Now'. You'll be guided through a secure checkout process to reserve your seat in the upcoming batch." },
                            { q: "Are the classes live or pre-recorded?", a: "All our classes are 100% live and interactive. We believe in real-time feedback and direct instructor engagement, so we do not provide pre-recorded sessions. This ensures you get the personal attention required to master the material." },
                            { q: "Can I get a refund after purchasing a course or service?", a: "No. Because our classes are live and seats per batch are strictly limited, your enrollment instantly reserves a spot that cannot be offered to another student. Therefore, all sales are final, and we do not offer refunds under any circumstances." }
                        ]`;

let content = fs.readFileSync('app/contact/page.tsx', 'utf8');

content = content.replace(/\[\s*\{\s*q:\s*"How do I enroll in a course\?",[\s\S]*?\]/, flattenFaqs1);

fs.writeFileSync('app/contact/page.tsx', content);
console.log("Updated app/contact/page.tsx");
