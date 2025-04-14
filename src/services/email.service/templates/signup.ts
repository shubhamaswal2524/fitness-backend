export const getCongratulationsTemplate = (name: string) => {
  return `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px;">
        <h2 style="color: #4CAF50;">🎉 Congratulations, ${name}! 🎉</h2>
        <p>We are thrilled to celebrate your achievement with you!</p>
        <p>Keep up the fantastic work, and we look forward to seeing more success from you.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>Your Company Name</strong></p>
      </div>
    `;
};
