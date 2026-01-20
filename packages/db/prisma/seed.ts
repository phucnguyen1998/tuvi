import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const run = async () => {
  const adminEmail = "admin@tuvi.local";
  const staffEmail = "staff@tuvi.local";

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      password: bcrypt.hashSync("admin123", 10),
      role: "admin"
    }
  });

  await prisma.adminUser.upsert({
    where: { email: staffEmail },
    update: {},
    create: {
      email: staffEmail,
      name: "Staff",
      password: bcrypt.hashSync("staff123", 10),
      role: "staff"
    }
  });

  await prisma.promptTemplate.upsert({
    where: { version: "v1" },
    update: {},
    create: {
      version: "v1",
      title: "Luận giải tổng quan v1",
      system:
        "Bạn là thầy tử vi kinh nghiệm. Trình bày dễ hiểu, không phán tuyệt đối. Kèm lời nhắc đây chỉ là tham khảo.",
      user:
        "Dựa trên JSON lá số dưới đây, hãy viết tổng quan, tập trung năm xem hạn và khuyến nghị hành động. Trả về Markdown có heading rõ. JSON: {{chart_snapshot}}"
    }
  });
};

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
