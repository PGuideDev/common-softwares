// 银河飞行背景效果
function initGalaxy() {
    const canvas = document.getElementById('galaxy-bg');
    const ctx = canvas.getContext('2d');

    // 设置Canvas尺寸为窗口大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 星星类
    class Star {
        constructor() {
            this.reset();
            // 添加随机初始闪烁位置
            this.twinkleOffset = Math.random() * Math.PI * 2;
        }

        reset() {
            // 更分散的位置分布
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5;
            this.speed = 0.02 + Math.random() * 0.1; // 更慢的速度
            this.baseAlpha = 0.3 + Math.random() * 0.4; // 基础透明度
            this.twinkleSpeed = 0.0005 + Math.random() * 0.001; // 更慢的闪烁速度
            this.twinkleAmplitude = 0.3 + Math.random() * 0.3; // 闪烁幅度
            this.twinkleDirection = 1;
            this.updateColor();
        }

        update() {
            this.x -= this.speed;
            if (this.x < -10) {
                this.reset();
                this.x = canvas.width + 10;
            }

            // 更新闪烁效果
            this.updateColor();
        }

        updateColor() {
            // 使用正弦函数创建平滑闪烁效果
            const twinkleFactor = Math.sin(Date.now() * this.twinkleSpeed + this.twinkleOffset);
            this.alpha = this.baseAlpha + (twinkleFactor * this.twinkleAmplitude);
            this.color = `rgba(255, 255, 255, ${this.alpha})`;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 星云类 - 改进位置随机分布
    class Nebula {
        constructor() {
            // 更分散的位置分布
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;

            // 确保星云不会太偏离中心
            const canvasCenterX = canvas.width / 2;
            const canvasCenterY = canvas.height / 2;
            const maxDistance = Math.min(canvas.width, canvas.height) / 3;

            // 如果太偏离中心，重新定位
            const distance = Math.sqrt(
                Math.pow(this.x - canvasCenterX, 2) +
                Math.pow(this.y - canvasCenterY, 2)
            );

            if (distance > maxDistance) {
                const angle = Math.random() * Math.PI * 2;
                const newDistance = maxDistance * Math.random();
                this.x = canvasCenterX + Math.cos(angle) * newDistance;
                this.y = canvasCenterY + Math.sin(angle) * newDistance;
            }

            this.radius = 50 + Math.random() * 150;
            this.alpha = 0.01 + Math.random() * 0.09;
            this.speed = 0.001 + Math.random() * 0.003; // 更慢的速度
            this.baseColor = this.getRandomBaseColor();
        }

        getRandomBaseColor() {
            const colors = [
                { r: 138, g: 43, b: 226 }, // 蓝紫色
                { r: 75, g: 0, b: 130 },   // 靛蓝色
                { r: 0, g: 191, b: 255 },   // 深天蓝色
                { r: 123, g: 104, b: 238 }, // 中紫色
                { r: 106, g: 90, b: 205 }   // 石板蓝
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.alpha += this.speed;
            // 确保alpha值在0.01到0.1范围内
            if (this.alpha > 0.1) {
                this.alpha = 0.1;
                this.speed *= -1;
            } else if (this.alpha < 0.01) {
                this.alpha = 0.01;
                this.speed *= -1;
            }
        }

        draw() {
            // 生成完整的rgba颜色字符串
            const color = `rgba(${this.baseColor.r}, ${this.baseColor.g}, ${this.baseColor.b}, ${this.alpha})`;

            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius
            );
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, 'rgba(10, 10, 11, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 创建星星
    const stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push(new Star());
    }

    // 创建星云 - 使用更分散的位置
    const nebulas = [];
    for (let i = 0; i < 8; i++) {
        nebulas.push(new Nebula());
    }

    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制银河核心光晕
        const centerX = canvas.width * 0.3;
        const centerY = canvas.height * 0.5;
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, 300
        );
        gradient.addColorStop(0, 'rgba(138, 43, 226, 0.25)');
        gradient.addColorStop(0.7, 'rgba(10, 10, 11, 0.1)');
        gradient.addColorStop(1, 'rgba(10, 10, 11, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 300, 0, Math.PI * 2);
        ctx.fill();

        // 绘制星云
        nebulas.forEach(nebula => {
            nebula.update();
            nebula.draw();
        });

        // 绘制星星
        stars.forEach(star => {
            star.update();
            star.draw();
        });

        // 减少快速移动恒星的出现频率
        if (Math.random() < 0.2) { // 30%的概率出现
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = 0.5 + Math.random();
            const alpha = 0.2 + Math.random() * 0.3;

            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();

            // 添加光晕效果
            const glowSize = size * 3;
            const glowGradient = ctx.createRadialGradient(
                x, y, size,
                x, y, glowSize
            );
            glowGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
            glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(x, y, glowSize, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    animate();
} 