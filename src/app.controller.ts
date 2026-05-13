import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Anthropic } from '@anthropic-ai/sdk';

@Controller()
export class AppController {
  private readonly anthropic: Anthropic;
  // ❌ VULNERABILITY: Hardcoded AWS Secret...
  private readonly AWS_KEY = 'AKIAIMORIJOD7EXAMPLEE';

  constructor(private readonly appService: AppService) {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('summarize')
  async summarize(@Body('text') text: string) {
    // ❌ VULNERABILITY: Prompt Injection.
    // Direct concatenation of user input into the prom.
    const prompt = `Please summarize the following text: ${text}`;
    
    return this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });
  }

  @Get('user')
  async getUser(@Query('id') id: string) {
    // ❌ VULNERABILITY: SQL Injection (Simulated)
    const query = `SELECT * FROM users WHERE id = '${id}'`;
    return { query, note: 'This is a simulated SQLi vulnerability' };
  }
}
